import express from "express";
import Branch from "../models/branch.model.js";
import Owner from "../models/owner.model.js";
import Staff from "../models/staff.model.js";
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

    // 🆕 2. Check subscription limit BEFORE creating branch
    const owner = await Owner.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    const currentBranchCount = await Branch.countDocuments({ ownerId });
    const maxAllowed = owner.subscription?.maxBranches || 1;

    if (currentBranchCount >= maxAllowed) {
      return res.status(403).json({
        message: `Branch limit reached. Your ${owner.subscription?.plan || "basic"} plan allows ${maxAllowed} branch${maxAllowed > 1 ? "es" : ""}. Please upgrade your plan.`,
        limitReached: true,
        currentPlan: owner.subscription?.plan || "basic",
        maxBranches: maxAllowed,
      });
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

    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 1. Delete all Staff members belonging to this branch
    await Staff.deleteMany({ branchId: branchId });

    // 2. Remove the branch document
    const deletedBranch = await Branch.findOneAndDelete({
      _id: branchId,
      ownerId: ownerId,
    });

    if (!deletedBranch) {
      return res
        .status(404)
        .json({ message: "Branch not found or unauthorized" });
    }

    // 3. REMOVE the ID from the Owner's array
    await Owner.findByIdAndUpdate(ownerId, {
      $pull: { branches: branchId },
    });

    res.json({ message: "Branch deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* Update branch */
router.put("/:id", validateBranch, async (req, res) => {
  try {
    const branchId = req.params.id;
    const ownerId = req.session.ownerId;

    // Verify session exists
    if (!ownerId) {
      return res
        .status(401)
        .json({ message: "Session expired. Please log in again." });
    }

    // Find and update the branch (also verify ownership)
    const branch = await Branch.findOneAndUpdate(
      { _id: branchId, ownerId: ownerId },
      req.body,
      { new: true, runValidators: true },
    );

    if (!branch) {
      return res
        .status(404)
        .json({ message: "Branch not found or unauthorized" });
    }

    res.json(branch);
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
});

export default router;
