import express from "express";
import Owner from "../models/owner.model.js";

const router = express.Router();

// Plan configurations
const PLANS = {
  basic: { maxBranches: 1, price: 29 },
  standard: { maxBranches: 5, price: 99 },
  premium: { maxBranches: 10, price: 199 },
};

/* Get current subscription details */
router.get("/current", async (req, res) => {
  try {
    const ownerId = req.session.ownerId;

    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized. Please login." });
    }

    const owner = await Owner.findById(ownerId).select("subscription branches");
    
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    // Count current branches
    const currentBranchCount = owner.branches.length;

    res.json({
      subscription: owner.subscription,
      currentBranchCount,
      availablePlans: PLANS,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* Upgrade subscription plan */
router.post("/upgrade", async (req, res) => {
  try {
    const ownerId = req.session.ownerId;
    const { newPlan } = req.body;

    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized. Please login." });
    }

    // Validate plan
    if (!PLANS[newPlan]) {
      return res.status(400).json({ message: "Invalid plan selected" });
    }

    const owner = await Owner.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    // Check if it's actually an upgrade
    const currentPlan = owner.subscription?.plan || "basic";
    const planOrder = ["basic", "standard", "premium"];
    
    if (planOrder.indexOf(newPlan) <= planOrder.indexOf(currentPlan)) {
      return res.status(400).json({ 
        message: "You can only upgrade to a higher plan. Downgrades are not supported." 
      });
    }

    // Update subscription
    owner.subscription = {
      plan: newPlan,
      maxBranches: PLANS[newPlan].maxBranches,
      startDate: new Date(),
    };

    await owner.save();

    res.json({
      success: true,
      message: `Successfully upgraded to ${newPlan} plan!`,
      subscription: owner.subscription,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;