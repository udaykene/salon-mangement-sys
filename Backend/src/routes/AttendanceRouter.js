import express from "express";
const router = express.Router();
import Attendance from "../models/attendance.model.js";
import Staff from "../models/staff.model.js";
import mongoose from "mongoose";

// GET /api/attendance?date=YYYY-MM-DD&branchId=xxx
// Admin: returns attendance for all staff (or filtered by branchId)
// Receptionist: returns attendance only for their branch, excludes self
router.get("/", async (req, res) => {
  try {
    console.log("--- Attendance Fetch Start ---");
    const { role, ownerId, staffId, branchId: sessionBranchId } = req.session;

    console.log("DEBUG: Session Context:", {
      role,
      ownerId,
      staffId,
      sessionBranchId,
    });
    console.log("DEBUG: ownerId type:", typeof ownerId);

    if (!role || !ownerId) {
      console.log(
        "ERROR: Unauthorized access attempt - no role or ownerId in session",
      );
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const { date, branchId } = req.query;
    console.log("DEBUG: Query Params:", { date, branchId });

    if (!date) {
      console.log("ERROR: Date missing in request");
      return res.status(400).json({ message: "Date query param is required." });
    }

    // Build staff query
    // Ensure ownerId is an ObjectId for the query
    const staffQuery = { ownerId: new mongoose.Types.ObjectId(ownerId) };

    if (role === "receptionist") {
      // Receptionist can only see their own branch
      staffQuery.branchId = sessionBranchId;
    } else if (role === "admin" && branchId) {
      // Admin filtering by specific branch
      staffQuery.branchId = branchId;
    }

    console.log("DEBUG: Attendance staffQuery:", JSON.stringify(staffQuery));

    // Fetch all staff matching the query
    let staffList = await Staff.find(staffQuery)
      .select("name phone role branchId status")
      .sort({ name: 1 });

    console.log("DEBUG: Attendance staffList found in DB:", staffList.length);

    // For receptionist, exclude self from the list
    if (role === "receptionist" && staffId) {
      console.log("DEBUG: Filtering out receptionistId:", staffId);
      staffList = staffList.filter(
        (s) => s._id.toString() !== staffId.toString(),
      );
    }
    console.log(
      "DEBUG: Attendance staffList final result count:",
      staffList.length,
    );

    // Fetch attendance records for these staff on the given date
    const staffIds = staffList.map((s) => s._id);
    const attendanceRecords = await Attendance.find({
      staffId: { $in: staffIds },
      date,
    });

    // Build a map: staffId -> attendance status
    const attendanceMap = {};
    attendanceRecords.forEach((rec) => {
      attendanceMap[rec.staffId.toString()] = rec.status;
    });

    // Merge staff with attendance
    const result = staffList.map((s) => ({
      _id: s._id,
      name: s.name,
      phone: s.phone,
      role: s.role,
      branchId: s.branchId,
      staffStatus: s.status,
      attendance: attendanceMap[s._id.toString()] || null, // null = not marked yet
    }));

    res.json(result);
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res
      .status(500)
      .json({ message: err.message || "Error fetching attendance" });
  }
});

// POST /api/attendance/mark
// Mark or update attendance for a single staff member
// Body: { staffId, date, status }
router.post("/mark", async (req, res) => {
  try {
    const { role, ownerId } = req.session;

    if (!role || !ownerId) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const { staffId, date, status } = req.body;

    if (!staffId || !date || !status) {
      return res
        .status(400)
        .json({ message: "staffId, date, and status are required." });
    }

    if (!["present", "absent", "on-leave"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Status must be 'present', 'absent', or 'on-leave'." });
    }

    // Verify the staff belongs to this owner
    const staff = await Staff.findOne({ _id: staffId, ownerId });
    if (!staff) {
      return res
        .status(404)
        .json({ message: "Staff not found or does not belong to you." });
    }

    // Upsert: update if exists, create if not
    const record = await Attendance.findOneAndUpdate(
      { staffId, date },
      {
        staffId,
        branchId: staff.branchId,
        ownerId,
        date,
        status,
      },
      { upsert: true, new: true, runValidators: true },
    );

    res.json(record);
  } catch (err) {
    console.error("Error marking attendance:", err);
    res
      .status(500)
      .json({ message: err.message || "Error marking attendance" });
  }
});

// POST /api/attendance/mark-bulk
// Mark attendance for multiple staff at once
// Body: { date, records: [{ staffId, status }] }
router.post("/mark-bulk", async (req, res) => {
  try {
    const { role, ownerId } = req.session;

    if (!role || !ownerId) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const { date, records } = req.body;

    if (!date || !records || !Array.isArray(records) || records.length === 0) {
      return res
        .status(400)
        .json({ message: "date and records array are required." });
    }

    // Verify all staff belong to this owner
    const staffIds = records.map((r) => r.staffId);
    const staffList = await Staff.find({ _id: { $in: staffIds }, ownerId });

    if (staffList.length !== staffIds.length) {
      return res.status(400).json({
        message: "Some staff members not found or do not belong to you.",
      });
    }

    // Build a branchId map
    const branchMap = {};
    staffList.forEach((s) => {
      branchMap[s._id.toString()] = s.branchId;
    });

    // Bulk upsert using bulkWrite
    const ops = records.map((r) => ({
      updateOne: {
        filter: { staffId: r.staffId, date },
        update: {
          $set: {
            staffId: r.staffId,
            branchId: branchMap[r.staffId],
            ownerId,
            date,
            status: r.status,
          },
        },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(ops);

    res.json({
      message: "Attendance marked successfully",
      count: records.length,
    });
  } catch (err) {
    console.error("Error bulk marking attendance:", err);
    res
      .status(500)
      .json({ message: err.message || "Error marking attendance" });
  }
});

// GET /api/attendance/stats
// Returns attendance counts (present, absent, on-leave) for a date range
// Query: startDate, endDate, branchId (optional)
router.get("/stats", async (req, res) => {
  try {
    const { role, ownerId, branchId: sessionBranchId } = req.session;
    if (!role || !ownerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { startDate, endDate, branchId } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ message: "startDate and endDate are required" });
    }

    const query = {
      ownerId,
      date: { $gte: startDate, $lte: endDate },
    };

    if (role === "receptionist") {
      query.branchId = sessionBranchId;
    } else if (role === "admin" && branchId && branchId !== "all") {
      query.branchId = branchId;
    }

    const records = await Attendance.find(query);

    const stats = {
      present: 0,
      absent: 0,
      "on-leave": 0,
      total: records.length,
    };

    records.forEach(r => {
      if (stats[r.status] !== undefined) {
        stats[r.status]++;
      }
    });

    res.json(stats);
  } catch (err) {
    console.error("Error fetching attendance stats:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/attendance/calendar
// Returns daily attendance status for a specific staff member in a date range
// Query: staffId, startDate, endDate
router.get("/calendar", async (req, res) => {
  try {
    const { role, ownerId } = req.session;
    if (!role || !ownerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { staffId, startDate, endDate } = req.query;
    if (!staffId || !startDate || !endDate) {
      return res.status(400).json({ message: "staffId, startDate, and endDate are required" });
    }

    const records = await Attendance.find({
      ownerId,
      staffId,
      date: { $gte: startDate, $lte: endDate },
    }).select("date status"); // Only need date and status

    // Create a map of date -> status
    const calendarData = {};
    records.forEach(r => {
      calendarData[r.date] = r.status;
    });

    // Calculate summary for this period
    const summary = {
      present: records.filter(r => r.status === "present").length,
      absent: records.filter(r => r.status === "absent").length,
      "on-leave": records.filter(r => r.status === "on-leave").length,
    };

    res.json({ calendar: calendarData, summary });

  } catch (err) {
    console.error("Error fetching calendar data:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
