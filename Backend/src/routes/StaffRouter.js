import express from "express";
const router = express.Router();
import Staff from "../models/staff.model.js"; // Adjust path to your model
import Branch from "../models/branch.model.js";
import { Appointment } from "../models/Appointment.js";
import Service from "../models/services.model.js";

// GET: Fetch all staff with availability status
router.get("/availability", async (req, res) => {
  try {
    const ownerId = req.session.ownerId;
    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const { branchId, date, time } = req.query;
    // Default to current date/time if not provided
    const checkDate = date ? new Date(date) : new Date();
    const checkTimeStr = time || checkDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

    // Helper to parse "HH:MM AM/PM" to minutes from midnight
    const parseTime = (timeStr) => {
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':');
      if (hours === '12') hours = '00';
      if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
      return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
    };

    // Helper to parse duration string "45 min" -> 45
    const parseDuration = (durStr) => {
      if (!durStr) return 30; // Default
      const matches = durStr.match(/(\d+)/);
      return matches ? parseInt(matches[0], 10) : 30;
    };

    const { role, branchId: sessionBranchId } = req.session;

    let query = { ownerId };

    // 2. Determine Branch Filter
    // REVERTED: Strict isolation for Receptionist based on TL feedback.
    if (role && role.toLowerCase() === 'receptionist') {
      // Force the query to use the logged-in user's branch (which we can get from session or DB lookup above if we did that)
      // We'll rely on session/stored branchId. Ideally we trust req.session.branchId or fetch it.
      // For safety, let's use the one from session. 
      query.branchId = sessionBranchId;

      // Note: We ignore req.query.branchId for Receptionists now.
    } else {
      // Admin or other roles might want to filter
      if (branchId && branchId !== "all") {
        query.branchId = branchId;
      }
    }

    const appointmentQuery = {
      date: checkDate.toISOString().split('T')[0],
      status: { $nin: ["Cancelled", "Completed"] }
    };
    if (query.branchId) {
      appointmentQuery.branchId = query.branchId;
    }

    const [staffMembers, appointments, services] = await Promise.all([
      Staff.find(query),
      Appointment.find(appointmentQuery),
      Service.find({ branchId: query.branchId || branchId })
    ]);

    // Create a map of service duration
    const serviceDurations = services.reduce((acc, curr) => {
      acc[curr.name] = parseDuration(curr.duration);
      return acc;
    }, {});

    const currentMinutes = parseTime(checkTimeStr);
    const dayName = checkDate.toLocaleDateString('en-US', { weekday: 'short' }); // Mon, Tue...

    const staffWithStatus = staffMembers.map(staff => {
      // 0. Check Stored Status (Priority)
      if (staff.status && staff.status !== 'active') {
        return { ...staff.toObject(), currentStatus: staff.status, nextAvailable: "N/A" };
      }

      // FIX: Handle "Receptionist" default roleTitle masking actual role (e.g. Barber)
      // If role is specific (not "staff") and roleTitle is default "Receptionist", prefer role.
      let displayRole = staff.roleTitle;
      const actualRole = staff.role;
      if (actualRole && actualRole.toLowerCase() !== "staff" && displayRole === "Receptionist" && actualRole !== "Receptionist") {
        displayRole = actualRole;
      }

      // ... continue mapping, injection displayRole into returned object if needed
      // Actually, we can just mutate the object we return

      // 1. Check Working Days
      if (!staff.workingDays || !staff.workingDays.includes(dayName)) {
        return {
          ...staff.toObject(),
          roleTitle: displayRole, // Override with corrected value
          currentStatus: "off-duty",
          nextAvailable: "Next Working Day"
        };
      }

      // 2. Check Working Hours
      if (staff.workingHours && staff.workingHours.start && staff.workingHours.end) {
        const startMin = parseTime(staff.workingHours.start);
        const endMin = parseTime(staff.workingHours.end);
        if (currentMinutes < startMin || currentMinutes > endMin) {
          return {
            ...staff.toObject(),
            roleTitle: displayRole,
            currentStatus: "off-duty",
            nextAvailable: staff.workingHours.start
          };
        }
      }

      // 3. Check Appointments
      const staffApps = appointments.filter(app => {
        return app.staff === staff._id.toString() || app.staff === staff.name;
      });

      const busyApp = staffApps.find(app => {
        const appStart = parseTime(app.time);
        const duration = serviceDurations[app.service] || 30; // fallback 30 mins
        const appEnd = appStart + duration;
        return currentMinutes >= appStart && currentMinutes < appEnd;
      });

      if (busyApp) {
        // ... (time calc)
        const appStart = parseTime(busyApp.time);
        const duration = serviceDurations[busyApp.service] || 30;
        const appEnd = appStart + duration;

        // Convert appEnd back to time string for nextAvailable
        const endH = Math.floor(appEnd / 60);
        const endM = appEnd % 60;
        const ampm = endH >= 12 ? 'PM' : 'AM';
        const formattedH = endH % 12 || 12;
        const formattedTime = `${formattedH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')} ${ampm}`;

        return {
          ...staff.toObject(),
          roleTitle: displayRole,
          currentStatus: "busy",
          currentClient: busyApp.customerName,
          nextAvailable: formattedTime
        };
      }

      return {
        ...staff.toObject(),
        roleTitle: displayRole,
        currentStatus: "available",
        nextAvailable: "Now"
      };
    });

    res.json(staffWithStatus);

  } catch (err) {
    console.error("Error fetching staff availability:", err);
    res.status(500).json({ message: err.message || "Error fetching availability" });
  }
});

// GET: Fetch all staff (unchanged, or apply same fix? Usually only admin sees this)
// ...

// POST: Create a new staff member
router.post("/", async (req, res) => {
  try {
    const ownerId = req.session.ownerId;

    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    // FIX: Ensure roleTitle matches role if not provided
    if (!req.body.roleTitle && req.body.role) {
      req.body.roleTitle = req.body.role;
    }

    // Convert specialization from string to array if it's a string
    // ...
    if (typeof req.body.specialization === "string") {
      req.body.specialization = req.body.specialization
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);
    }

    const newStaff = new Staff({
      ...req.body,
      ownerId, // Injected from session
    });
    const savedStaff = await newStaff.save();

    // DEBUG: Check if branchId exists in request
    console.log("Adding staff to branch ID:", req.body.branchId);

    // --- UPDATE BRANCH ARRAY ---
    // Push the new staff ID into the corresponding branch's staff array
    const updatedBranch = await Branch.findByIdAndUpdate(
      req.body.branchId,
      {
        $push: { staffs: savedStaff._id },
      },
      { new: true },
    );

    console.log("Updated Branch Document:", updatedBranch);

    res.status(201).json(savedStaff);
  } catch (err) {
    console.error("Error creating staff:", err);

    // Handle duplicate phone number error
    if (err.code === 11000 && err.keyPattern?.phone) {
      return res.status(400).json({
        message: "A staff member with this phone number already exists.",
      });
    }

    res.status(400).json({
      message: err.message || "Error creating staff member",
    });
  }
});

// PUT: Update staff
router.put("/:id", async (req, res) => {
  try {
    const ownerId = req.session.ownerId;

    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    // Verify that the staff belongs to the logged-in owner
    const existingStaff = await Staff.findOne({ _id: req.params.id, ownerId });
    if (!existingStaff) {
      return res.status(404).json({
        message:
          "Staff member not found or you do not have permission to edit.",
      });
    }

    const oldBranchId = existingStaff.branchId.toString();
    const newBranchId = req.body.branchId;

    // FIX: Ensure roleTitle matches role if updated
    if (!req.body.roleTitle && req.body.role) {
      req.body.roleTitle = req.body.role;
    }

    // Convert specialization from string to array if it's a string
    if (typeof req.body.specialization === "string") {
      req.body.specialization = req.body.specialization
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);
    }

    const updatedStaff = await Staff.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    // --- UPDATE BRANCH ARRAYS IF BRANCH CHANGED ---
    if (newBranchId && oldBranchId !== newBranchId) {
      // Remove from old branch
      await Branch.findByIdAndUpdate(oldBranchId, {
        $pull: { staffs: updatedStaff._id },
      });
      // Add to new branch
      await Branch.findByIdAndUpdate(newBranchId, {
        $push: { staffs: updatedStaff._id },
      });
    }

    res.json(updatedStaff);
  } catch (err) {
    console.error("Error updating staff:", err);

    // Handle duplicate phone number error
    if (err.code === 11000 && err.keyPattern?.phone) {
      return res.status(400).json({
        message: "A staff member with this phone number already exists.",
      });
    }

    res.status(400).json({
      message: err.message || "Error updating staff member",
    });
  }
});

// PATCH: Toggle staff status
router.patch("/:id/status", async (req, res) => {
  try {
    const ownerId = req.session.ownerId;

    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const { status } = req.body;

    // Validate status
    if (!["active", "on-leave", "inactive"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be: active, on-leave, or inactive",
      });
    }

    // Verify that the staff belongs to the logged-in owner
    const existingStaff = await Staff.findOne({ _id: req.params.id, ownerId });

    if (!existingStaff) {
      return res.status(404).json({
        message:
          "Staff member not found or you do not have permission to edit.",
      });
    }

    const updatedStaff = await Staff.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    );

    res.json(updatedStaff);
  } catch (err) {
    console.error("Error updating staff status:", err);
    res.status(500).json({
      message: err.message || "Error updating staff status",
    });
  }
});

// DELETE: Remove staff
router.delete("/:id", async (req, res) => {
  try {
    const ownerId = req.session.ownerId;

    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    // Verify that the staff belongs to the logged-in owner
    const existingStaff = await Staff.findOne({ _id: req.params.id, ownerId });
    if (!existingStaff) {
      return res.status(404).json({
        message:
          "Staff member not found or you do not have permission to delete.",
      });
    }
    const branchId = existingStaff.branchId;
    await Staff.findByIdAndDelete(req.params.id);

    // --- UPDATE BRANCH ARRAY ---
    // Pull the staff ID out of the branch's staff array
    await Branch.findByIdAndUpdate(branchId, {
      $pull: { staffs: req.params.id },
    });

    res.json({ message: "Staff deleted successfully" });
  } catch (err) {
    console.error("Error deleting staff:", err);
    res.status(500).json({
      message: err.message || "Error deleting staff member",
    });
  }
});

export default router;
