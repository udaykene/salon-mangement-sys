import express from "express";
import { validateService } from "../middlewares/ServiceValidation.js";
import {
  createService,
  getServices,
  updateService,
  toggleServiceStatus,
  deleteService,
} from "../controllers/ServiceController.js";
import Service from "../models/services.model.js";

const router = express.Router();

/* PUBLIC: Get active services for a branch (no auth) */
router.get("/public", async (req, res) => {
  try {
    const { branchId, category } = req.query;
    if (!branchId)
      return res
        .status(400)
        .json({ success: false, message: "branchId required" });
    const query = { branchId, status: "active" };
    if (category && category !== "all") query.category = category;
    const services = await Service.find(query)
      .populate("category", "name")
      .populate("staffIds", "name roleTitle specialization");
    res.json({ success: true, services });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/", validateService, createService);
router.get("/", getServices);
router.put("/:id", validateService, updateService);
router.patch("/:id/status", toggleServiceStatus);
router.delete("/:id", deleteService);

export default router;
