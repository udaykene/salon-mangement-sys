import express from "express";
import Owner from "../models/owner.model.js";
import Staff from "../models/staff.model.js";
import Branch from "../models/branch.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { role, ownerId, staffId, branchId } = req.session;

    // Not logged in
    if (!role) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // ================= OWNER PROFILE =================
    if (role === "admin") {
      const owner = await Owner.findById(ownerId).select(
        "name email phone isActive createdAt",
      );

      if (!owner) {
        return res.status(404).json({ message: "Owner not found" });
      }

      return res.json({
        role: role,
        profile: {
          ...owner.toObject(),
          roleLabel: "Salon Owner",
          branchName: null,
        },
      });
    }

    // ================= RECEPTIONIST PROFILE =================
    if (role === "receptionist") {
      const staff = await Staff.findById(staffId).select(
        "name phone email status createdAt allowedTabs branchId",
      );

      if (!staff) {
        return res.status(404).json({ message: "Staff not found" });
      }

      // If branchId is not in session, use the one from staff document
      const effectiveBranchId = branchId || staff.branchId;

      const branch = await Branch.findById(effectiveBranchId).select("name");

      return res.json({
        role: role,
        profile: {
          name: staff.name,
          email: staff.email,
          phone: staff.phone,
          isActive: staff.status === "active",
          createdAt: staff.createdAt,
          roleLabel: "Receptionist",
          branchId: effectiveBranchId,
          branchName: branch?.name || null,
          allowedTabs: staff.allowedTabs || [],
        },
      });
    }

    // ================= BLOCK EVERYTHING ELSE =================
    return res.status(403).json({ message: "Access denied" });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// Update Salon Settings (Owner Only)
router.put("/salon", async (req, res) => {
  try {
    const { role, ownerId } = req.session;

    if (role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, email, phone, address, currency } = req.body;

    const owner = await Owner.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    // Update salon settings
    owner.salonSettings = {
      ...owner.salonSettings,
      name,
      email,
      phone,
      address,
      currency,
    };

    await owner.save();

    res.json({
      message: "Salon settings updated",
      salonSettings: owner.salonSettings,
    });
  } catch (err) {
    console.error("Salon settings update error:", err);
    res.status(500).json({ message: "Failed to update settings" });
  }
});

export default router;
