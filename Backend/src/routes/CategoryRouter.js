import express from "express";
import mongoose from "mongoose";
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "../controllers/CategoryController.js";
import Category from "../models/category.model.js";

const router = express.Router();

/* PUBLIC: Get categories for a branch (no auth) */
router.get("/public/:branchId", async (req, res) => {
  try {
    const { branchId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(branchId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid branchId" });
    }

    const categories = await Category.find({ branchId })
      .select("name branchId")
      .sort({ name: 1 })
      .lean();
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/:branchId", getCategories);
router.post("/", createCategory);
router.delete("/:id", deleteCategory);

export default router;
