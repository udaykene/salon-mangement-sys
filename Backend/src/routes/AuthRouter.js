import express from "express";
import Owner from "../models/owner.model.js";
import { SignUpValidation, LoginValidation } from "../middlewares/AuthValidation.js";

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

    res.status(201).json({
      success: true,
      message: "Owner registered successfully",
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
    if (!owner || owner.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      success: true,
      message: "Login successful",
      owner,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
