import { Appointment } from "../models/Appointment.js";
import { findOrCreateClient } from "./clientController.js";
import Branch from "../models/branch.model.js";

export const createAppointment = async (req, res) => {
  try {
    const {
      customerName,
      email,
      phone,
      category,
      service,
      staff,
      date,
      time,
      notes,
      branchId,
      clientId,
      price,
      location,
    } = req.body;

    // Basic validation
    if (
      !customerName ||
      !email ||
      !phone ||
      !category ||
      !service ||
      !date ||
      !time
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find or Create Client
    let finalClientId = clientId;
    if (!finalClientId) {
      const client = await findOrCreateClient({
        name: customerName,
        email,
        phone,
        location,
        branchId, // Pass branchId to ensure client is created/found in correct branch
      });
      finalClientId = client._id;
    }

    // Check for overbooking
    const existingAppointment = await Appointment.findOne({
      branchId,
      date,
      time,
      staff: staff || "Any",
      status: { $ne: "Cancelled" },
    });

    if (existingAppointment) {
      return res.status(400).json({ message: "This slot is already booked" });
    }

    const newAppointment = new Appointment({
      customerName,
      email,
      phone,
      category,
      service,
      staff: staff || "Any",
      date,
      time,
      notes,
      branchId,
      clientId: finalClientId,
      price,
      bookingType: req.body.bookingType || "Online",
    });

    const savedAppointment = await newAppointment.save();

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: savedAppointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: "Server error while booking appointment" });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const { branchId } = req.query;
    let query = {};

    if (branchId) {
      query.branchId = branchId;
    }

    const appointments = await Appointment.find(query).sort({ createdAt: -1 });
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching appointments" });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Status updated", appointment });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ message: "Server error while updating status" });
  }
};

export const getAvailableSlots = async (req, res) => {
  try {
    const { branchId, date, staff } = req.query;

    if (!branchId || !date) {
      return res
        .status(400)
        .json({ message: "branchId and date are required" });
    }

    const branch = await Branch.findById(branchId);
    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    const openingTime = branch.openingTime || "09:00";
    const closingTime = branch.closingTime || "21:00";

    // Generate 30-min slots
    const slots = [];
    const [openH, openM] = openingTime.split(":").map(Number);
    const [closeH, closeM] = closingTime.split(":").map(Number);

    let current = new Date(2000, 0, 1, openH, openM);
    const end = new Date(2000, 0, 1, closeH, closeM);

    while (current < end) {
      const timeString = current.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      slots.push({ time: timeString, available: true });
      current.setMinutes(current.getMinutes() + 30);
    }

    // Fetch existing appointments
    const query = { branchId, date, status: { $ne: "Cancelled" } };
    if (staff && staff !== "Any") {
      query.staff = staff;
    }

    const existingAppointments = await Appointment.find(query);

    // Mark unavailable slots
    slots.forEach((slot) => {
      // Normalize time string for comparison if needed
      // Most frontends send HH:MM AM/PM
      const isBooked = existingAppointments.some(
        (apt) => apt.time === slot.time,
      );
      if (isBooked) {
        slot.available = false;
      }
    });

    res.status(200).json(slots);
  } catch (error) {
    console.error("Error fetching available slots:", error);
    res.status(500).json({ message: "Server error while fetching slots" });
  }
};
