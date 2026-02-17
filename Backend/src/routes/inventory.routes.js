import express from "express";
import {
  createInventoryItem,
  getBranchInventory,
  getAllInventory,
  updateInventoryItem,
  deleteInventoryItem,
} from "../controllers/inventoryController.js";

const router = express.Router();

router.post("/", createInventoryItem);
router.get("/", getAllInventory);
router.get("/branch/:branchId", getBranchInventory);
router.patch("/:id", updateInventoryItem);
router.delete("/:id", deleteInventoryItem);

export default router;
