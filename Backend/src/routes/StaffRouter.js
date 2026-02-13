import express from "express";
const router = express.Router();
import Staff from "../models/staff.model.js"; // Adjust path to your model
import Branch from "../models/branch.model.js";

// GET: Fetch all staff for the logged-in owner
router.get("/", async (req, res) => {
  try {
    const ownerId = req.session.ownerId; // Assuming session stores ownerId

    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const { branchId } = req.query;
    let query = { ownerId };

    if (branchId) {
      query.branchId = branchId;
    }

    const staff = await Staff.find(query).sort({ createdAt: -1 });
    res.json(staff);
  } catch (err) {
    console.error("Error fetching staff:", err);
    res.status(500).json({ message: err.message || "Error fetching staff" });
  }
});

// POST: Create a new staff member
router.post("/", async (req, res) => {
  try {
    const ownerId = req.session.ownerId;

    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    // Convert specialization from string to array if it's a string
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
