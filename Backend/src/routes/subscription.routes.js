import express from "express";
import Owner from "../models/owner.model.js";

const router = express.Router();

// Plan configurations
const PLANS = {
  demo: { maxBranches: 1, price: 0, trialDuration: 2 * 60 * 1000 }, // 2 minutes for testing
  basic: { maxBranches: 1, price: 29 },
  standard: { maxBranches: 5, price: 99 },
  premium: { maxBranches: 10, price: 199 },
};

const PLAN_ORDER = [null, "demo", "basic", "standard", "premium"];

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

    // Compute trial status
    const plan = owner.subscription?.plan || null;
    const hasPlan = plan !== null;
    let isTrialExpired = false;

    if (plan === "demo" && owner.subscription?.trialEndDate) {
      isTrialExpired = new Date() > new Date(owner.subscription.trialEndDate);
    }

    res.json({
      subscription: owner.subscription,
      currentBranchCount,
      availablePlans: PLANS,
      hasPlan,
      isTrialExpired,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* Upgrade / select subscription plan */
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
    const currentPlan = owner.subscription?.plan || null;
    const currentIndex = PLAN_ORDER.indexOf(currentPlan);
    const newIndex = PLAN_ORDER.indexOf(newPlan);

    if (newIndex <= currentIndex) {
      return res.status(400).json({
        message:
          "You can only upgrade to a higher plan. Downgrades are not supported.",
      });
    }

    // Build subscription update
    const subscriptionUpdate = {
      plan: newPlan,
      maxBranches: PLANS[newPlan].maxBranches,
      startDate: new Date(),
    };

    // If demo plan, set trialEndDate (2 minutes for testing)
    if (newPlan === "demo") {
      subscriptionUpdate.trialEndDate = new Date(
        Date.now() + PLANS.demo.trialDuration,
      );
    } else {
      // Paid plan — clear trial end date
      subscriptionUpdate.trialEndDate = null;
    }

    owner.subscription = subscriptionUpdate;
    await owner.save();

    res.json({
      success: true,
      message:
        newPlan === "demo"
          ? "Demo plan activated! Your trial starts now."
          : `Successfully upgraded to ${newPlan} plan!`,
      subscription: owner.subscription,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
