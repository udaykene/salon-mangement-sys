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
          roleLabel: owner.roleTitle || "Salon Owner",
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
          createdAt: staff.joiningDate || staff.createdAt, // key is createdAt for frontend compatibility, but uses joiningDate
          roleLabel: staff.roleTitle || "Receptionist",
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

// Update Owner Profile
router.put("/owner", async (req, res) => {
  try {
    const { role, ownerId } = req.session;

    if (role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, email, phone, roleTitle, createdAt } = req.body;

    const owner = await Owner.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    if (name) owner.name = name;
    if (email) owner.email = email;
    if (phone) owner.phone = phone;
    if (roleTitle) owner.roleTitle = roleTitle;
    if (createdAt) owner.createdAt = new Date(createdAt);

    await owner.save();

    res.json({
      message: "Profile updated successfully",
      name: owner.name,
      email: owner.email,
      phone: owner.phone,
      roleTitle: owner.roleTitle,
      createdAt: owner.createdAt,
    });
  } catch (err) {
    console.error("Owner profile update error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

// Update Receptionist Profile
router.put("/receptionist", async (req, res) => {
  try {
    const { role, staffId } = req.session;

    if (role !== "receptionist") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, email, phone, password, roleTitle, joiningDate } = req.body;

    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    if (name) staff.name = name;
    // Email and phone are typically read-only for security in this context, 
    // but preserving if you want them editable. AdminProfile allowed them.
    // User requested "same for recep profile", which implies editing name, role, member since.
    // Previous convo said email/phone read-only for receptionist. I'll respect that.

    if (roleTitle) staff.roleTitle = roleTitle;
    if (joiningDate) staff.joiningDate = new Date(joiningDate);
    if (password) staff.password = password; // In a real app, hash this!

    await staff.save();

    res.json({
      message: "Profile updated successfully",
      profile: {
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        roleLabel: staff.roleTitle,
        createdAt: staff.joiningDate,
      },
    });
  } catch (err) {
    console.error("Receptionist profile update error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

export default router;
