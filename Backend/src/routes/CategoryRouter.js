import express from "express";
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "../controllers/CategoryController.js";

const router = express.Router();

router.get("/:branchId", getCategories);
router.post("/", createCategory);
router.delete("/:id", deleteCategory);

export default router;
