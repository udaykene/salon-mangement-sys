import express from "express";
import bcrypt from "bcryptjs";
import Owner from "../models/owner.model.js";
import Staff from "../models/staff.model.js";
import {
  SignUpValidation,
  LoginValidation,
  StaffLoginValidation,
} from "../middlewares/AuthValidation.js";

const router = express.Router();

router.post("/register", SignUpValidation, async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const exists = await Owner.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Owner already exists" });
    }

    const owner = await Owner.create({
      name,
      email,
      phone,
      password,
      subscription: {
        plan: null,
        maxBranches: 0,
      },
    });

    // 🔥 AUTO LOGIN
    req.session.ownerId = owner._id;
    req.session.role = "admin";
    res.status(201).json({
      success: true,
      message: "Owner registered & LOgged in ",
      owner,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", LoginValidation, async (req, res) => {
  try {
    const { email, password } = req.body;

    const owner = await Owner.findOne({ email });
    if (!owner) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔥 create session (same as signup)
    req.session.ownerId = owner._id;
    req.session.role = "admin";

    // Remove password from the object before sending to frontend
    const ownerData = owner.toObject();
    delete ownerData.password;
    res.json({
      success: true,
      message: "Login successful",
      owner: ownerData,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login/staff", StaffLoginValidation, async (req, res) => {
  try {
    const { phone } = req.body;

    // Find staff by phone number
    const staff = await Staff.findOne({ phone });

    if (!staff) {
      return res.status(400).json({
        message: "Staff member not found. Please check your phone number.",
      });
    }

    // DEBUG: Log the role being checked
    console.log(`Login attempt for ${phone}. Role found: '${staff.role}'`);

    // Verify role is receptionist (case-insensitive)
    if (!staff.role || staff.role.toLowerCase() !== "receptionist") {
      console.log("Access denied: Role mismatch");
      return res.status(403).json({
        message: `Access denied. Role is '${staff.role}', expected 'Receptionist'.`,
      });
    }

    // Check if staff is active
    if (staff.status !== "active") {
      return res.status(403).json({
        message: `Your account is ${staff.status}. Please contact your manager.`,
      });
    }

    // Create session with all required context
    req.session.staffId = staff._id;
    req.session.ownerId = staff.ownerId;
    req.session.branchId = staff.branchId; // Critical for data isolation
    req.session.role = "receptionist";

    // Remove sensitive data before sending
    const staffData = staff.toObject();
    delete staffData.password;

    res.json({
      success: true,
      message: "Login successful",
      staff: staffData,
    });
  } catch (err) {
    console.error("Staff login error:", err);
    res.status(500).json({ message: err.message || "Login failed" });
  }
});

router.get("/me", async (req, res) => {
  try {
    if (!req.session.role) {
      return res.json({ loggedIn: false });
    }

    // OWNER / ADMIN
    if (req.session.role === "admin") {
      return res.json({
        loggedIn: true,
        role: "admin",
      });
    }

    // RECEPTIONIST
    if (req.session.role === "receptionist") {
      const staff = await Staff.findById(req.session.staffId).populate(
        "branchId",
        "name",
      );

      return res.json({
        loggedIn: true,
        role: "receptionist",
        branch: staff?.branchId || null,
      });
    }

    return res.json({ loggedIn: false });
  } catch (err) {
    console.error("Auth me error:", err);
    res.status(500).json({ loggedIn: false });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
});

export default router;
