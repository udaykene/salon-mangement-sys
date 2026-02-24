import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/user.model.js";
import Otp from "../models/otp.model.js";
import { sendOtpEmail, sendWelcomeEmail } from "../utils/mailer.js";
import {
  CustomerSignUpValidation,
  CustomerLoginValidation,
  CustomerProfileUpdateValidation,
} from "../middlewares/CustomerAuthValidation.js";

const router = express.Router();

// ─── Helper: Generate 6-digit OTP ────────────────────────────────
function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

// ─── POST /signup ─────────────────────────────────────────────────
router.post("/signup", CustomerSignUpValidation, async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if user already exists and is verified
    const existing = await User.findOne({ email });
    if (existing && existing.emailVerified) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Email already registered. Please sign in.",
        });
    }

    // If unverified user exists, update their data
    let user;
    if (existing && !existing.emailVerified) {
      existing.name = name;
      existing.phone = phone;
      existing.password = password;
      await existing.save();
      user = existing;
    } else {
      user = await User.create({ name, email, phone, password });
    }

    // Generate and save OTP
    await Otp.deleteMany({ email, purpose: "signup" });
    const otp = generateOtp();
    await Otp.create({
      email,
      otp,
      purpose: "signup",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    });

    // Send OTP email
    await sendOtpEmail(email, otp, "signup");

    res.status(200).json({
      success: true,
      message:
        "OTP sent to your email. Please verify to complete registration.",
      email,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res
      .status(500)
      .json({ success: false, message: err.message || "Signup failed" });
  }
});

// ─── POST /verify-otp ────────────────────────────────────────────
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp, purpose = "signup" } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP are required" });
    }

    const otpRecord = await Otp.findOne({ email, otp, purpose });
    if (!otpRecord) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res
        .status(400)
        .json({
          success: false,
          message: "OTP has expired. Please request a new one.",
        });
    }

    // Clean up OTP
    await Otp.deleteMany({ email, purpose });

    if (purpose === "signup") {
      // Mark user as verified
      const user = await User.findOneAndUpdate(
        { email },
        { emailVerified: true },
        { new: true },
      );

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Create session
      req.session.customerId = user._id;
      req.session.role = "customer";

      // Send welcome email (non-blocking)
      sendWelcomeEmail(email, user.name).catch((err) =>
        console.error("Welcome email failed:", err),
      );

      const userData = user.toObject();
      delete userData.password;

      return res.json({
        success: true,
        message: "Email verified! Welcome to Glamour Studio.",
        user: userData,
      });
    }

    if (purpose === "email-change") {
      return res.json({
        success: true,
        message: "Email change verified.",
      });
    }

    if (purpose === "phone-change") {
      if (req.session.role !== "customer" || !req.session.customerId) {
        return res
          .status(401)
          .json({ success: false, message: "Not authenticated" });
      }

      const pending = req.session.pendingPhoneChange;
      if (!pending || pending.email !== email || pending.expiresAt < Date.now()) {
        req.session.pendingPhoneChange = null;
        return res.status(400).json({
          success: false,
          message: "No pending phone change request found. Please try again.",
        });
      }

      const user = await User.findById(req.session.customerId);
      if (!user) {
        req.session.pendingPhoneChange = null;
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      user.phone = pending.phone;
      await user.save();
      req.session.pendingPhoneChange = null;

      const userData = user.toObject();
      delete userData.password;

      return res.json({
        success: true,
        message: "Mobile number updated successfully.",
        user: userData,
      });
    }

    res.json({ success: true, message: "OTP verified" });
  } catch (err) {
    console.error("OTP verify error:", err);
    res
      .status(500)
      .json({ success: false, message: err.message || "Verification failed" });
  }
});

// ─── POST /resend-otp ────────────────────────────────────────────
router.post("/resend-otp", async (req, res) => {
  try {
    const { email, purpose = "signup" } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    if (purpose === "phone-change") {
      if (req.session.role !== "customer" || !req.session.customerId) {
        return res
          .status(401)
          .json({ success: false, message: "Not authenticated" });
      }

      const user = await User.findById(req.session.customerId).select("email");
      if (!user || user.email !== email) {
        return res.status(403).json({
          success: false,
          message: "Invalid OTP resend request",
        });
      }
    }

    // Rate limit: check if OTP was sent in last 60 seconds
    const recentOtp = await Otp.findOne({ email, purpose });
    if (recentOtp) {
      const timeSince = Date.now() - recentOtp.createdAt.getTime();
      if (timeSince < 60000) {
        const waitSeconds = Math.ceil((60000 - timeSince) / 1000);
        return res.status(429).json({
          success: false,
          message: `Please wait ${waitSeconds} seconds before requesting a new OTP`,
        });
      }
    }

    // Generate new OTP
    await Otp.deleteMany({ email, purpose });
    const otp = generateOtp();
    await Otp.create({
      email,
      otp,
      purpose,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendOtpEmail(email, otp, purpose);

    res.json({ success: true, message: "OTP resent successfully" });
  } catch (err) {
    console.error("Resend OTP error:", err);
    res
      .status(500)
      .json({ success: false, message: err.message || "Failed to resend OTP" });
  }
});

// ─── POST /login ─────────────────────────────────────────────────
router.post("/login", CustomerLoginValidation, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    if (!user.emailVerified) {
      return res.status(400).json({
        success: false,
        message:
          "Email not verified. Please sign up again to receive a new OTP.",
        needsVerification: true,
      });
    }

    if (!user.isActive) {
      return res
        .status(403)
        .json({ success: false, message: "Account is deactivated" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Create session
    req.session.customerId = user._id;
    req.session.role = "customer";

    const userData = user.toObject();
    delete userData.password;

    res.json({
      success: true,
      message: "Login successful",
      user: userData,
    });
  } catch (err) {
    console.error("Login error:", err);
    res
      .status(500)
      .json({ success: false, message: err.message || "Login failed" });
  }
});

// ─── GET /me ─────────────────────────────────────────────────────
router.get("/me", async (req, res) => {
  try {
    if (req.session.role !== "customer" || !req.session.customerId) {
      return res.json({ loggedIn: false });
    }

    const user = await User.findById(req.session.customerId).select(
      "-password",
    );
    if (!user || !user.isActive) {
      return res.json({ loggedIn: false });
    }

    res.json({
      loggedIn: true,
      role: "customer",
      user,
    });
  } catch (err) {
    console.error("Auth me error:", err);
    res.status(500).json({ loggedIn: false });
  }
});

// ─── GET /profile ────────────────────────────────────────────────
router.get("/profile", async (req, res) => {
  try {
    if (req.session.role !== "customer" || !req.session.customerId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    const user = await User.findById(req.session.customerId).select(
      "-password",
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PUT /profile ────────────────────────────────────────────────
router.put("/profile", CustomerProfileUpdateValidation, async (req, res) => {
  try {
    if (req.session.role !== "customer" || !req.session.customerId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    const user = await User.findById(req.session.customerId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { name, phone, gender, address, email } = req.body;

    // Email updates are not allowed from profile.
    if (email && email !== user.email) {
      return res.status(400).json({
        success: false,
        message: "Email cannot be updated from profile",
      });
    }

    // If phone changed, verify with OTP sent to existing email first.
    if (phone !== undefined && phone !== user.phone) {
      await Otp.deleteMany({ email: user.email, purpose: "phone-change" });
      const otp = generateOtp();
      await Otp.create({
        email: user.email,
        otp,
        purpose: "phone-change",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      });

      req.session.pendingPhoneChange = {
        phone,
        email: user.email,
        expiresAt: Date.now() + 10 * 60 * 1000,
      };

      await sendOtpEmail(user.email, otp, "phone-change");

      return res.json({
        success: true,
        requiresOtp: true,
        message:
          "OTP sent to your registered email. Verify to update mobile number.",
        otpEmail: user.email,
      });
    }

    // Update fields
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (gender !== undefined) user.gender = gender || null;
    if (address !== undefined) user.address = address;

    await user.save();

    const userData = user.toObject();
    delete userData.password;

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: userData,
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PUT /profile/email ──────────────────────────────────────────
// Email updates are disabled.
router.put("/profile/email", async (req, res) => {
  return res.status(403).json({
    success: false,
    message: "Email cannot be updated from profile",
  });
});

// ─── POST /logout ────────────────────────────────────────────────
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true, message: "Logged out successfully" });
  });
});

export default router;
