import express from "express";
import Branch from "../models/branch.model.js";
import Owner from "../models/owner.model.js"
import { validateBranch } from "../middlewares/BranchValidation.js";

const router = express.Router();

/* Create branch - Inject ownerId from session */
router.post("/", validateBranch, async (req, res) => {
  try {
    const ownerId = req.session.ownerId;

    // 1. Verify session exists
    if (!ownerId) {
      return res
        .status(401)
        .json({ message: "Session expired. Please log in again." });
    }

    const branchData = {
      ...req.body,
      ownerId: ownerId,
    };
    // 2. Create the branch
    const branch = await Branch.create(branchData);

    // 3. Update the Owner's branches array
    await Owner.findByIdAndUpdate(ownerId, { $push: { branches: branch._id } });

    res.status(201).json(branch);
  } catch (err) {
    // 2. Return the actual error message so the frontend can display it
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
});

/* Get all branches of logged-in owner */
router.get("/my-branches", async (req, res) => {
  try {
    // 🛡️ The server uses the session, not a URL param
    const ownerId = req.session.ownerId;

    if (!ownerId) {
      return res.status(401).json({ message: "Not authorized. Please login." });
    }

    const branches = await Branch.find({ ownerId });
    res.json(branches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* Toggle active status */
router.patch("/:id/status", async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);

    branch.isActive = !branch.isActive;
    await branch.save();

    res.json(branch);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* Delete branch */
router.delete("/:id", async (req, res) => {
  try {
    const branchId = req.params.id;
    const ownerId = req.session.ownerId;

    // Remove the branch document
    await Branch.findByIdAndDelete(branchId);

    // REMOVE the ID from the Owner's array
    await Owner.findByIdAndUpdate(ownerId, {
      $pull: { branches: branchId },
    });

    res.json({ message: "Branch deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
