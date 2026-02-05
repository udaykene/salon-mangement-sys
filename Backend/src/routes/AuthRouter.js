import express from "express";

import bcrypt from "bcryptjs";
import Owner from "../models/owner.model.js";
import {
  SignUpValidation,
  LoginValidation,
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
    });

    // 🔥 AUTO LOGIN
    req.session.ownerId = owner._id;
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

router.get("/me", (req, res) => {
  if (!req.session.ownerId) {
    return res.json({ loggedIn: false });
  }
  res.json({ loggedIn: true });
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
});

export default router;
