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
        "name phone email status createdAt allowedTabs",
      );

      if (!staff) {
        return res.status(404).json({ message: "Staff not found" });
      }

      const branch = await Branch.findById(branchId).select("name");

      return res.json({
        role: role,
        profile: {
          name: staff.name,
          email: staff.email,
          phone: staff.phone,
          isActive: staff.status === "active",
          createdAt: staff.createdAt,
          roleLabel: "Receptionist",
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

export default router;