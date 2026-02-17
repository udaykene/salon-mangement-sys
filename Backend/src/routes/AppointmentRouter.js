import express from "express";
import {
  createAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  getAvailableSlots,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/", createAppointment);
router.get("/", getAllAppointments);
router.get("/available-slots", getAvailableSlots);
router.patch("/:id/status", updateAppointmentStatus);

export default router;
