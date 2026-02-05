import express from "express";
import Branch from "../models/branch.model.js";
import { validateBranch } from "../middlewares/BranchValidation.js";

const router = express.Router();

/* Create branch - Inject ownerId from session */
router.post("/", validateBranch, async (req, res) => {
  try {
    const ownerId = req.session.ownerId;
    // 1. Verify session exists
    if (!ownerId) {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }

    const branchData = {
      ...req.body,
      ownerId:ownerId 
    };

    const branch = await Branch.create(branchData);
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

export default router;
