import express from "express";
import { validateService } from "../middlewares/ServiceValidation.js";
import {
  createService,
  getServices,
  updateService,
  toggleServiceStatus,
  deleteService,
} from "../controllers/ServiceController.js";

const router = express.Router();

router.post("/", validateService, createService);
router.get("/", getServices);
router.put("/:id", validateService, updateService);
router.patch("/:id/status", toggleServiceStatus);
router.delete("/:id", deleteService);

export default router;
