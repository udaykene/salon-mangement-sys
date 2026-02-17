import { Appointment } from "../models/Appointment.js";
import { findOrCreateClient } from "./clientController.js";
import Branch from "../models/branch.model.js";
import Service from "../models/services.model.js";
import Staff from "../models/staff.model.js";

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

    // Helpers
    const parseTime = (timeStr) => {
      const [t, modifier] = timeStr.split(' ');
      let [hours, minutes] = t.split(':');
      if (hours === '12') hours = '00';
      if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
      return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
    };

    const parseDuration = (durStr) => {
      if (!durStr) return 30;
      const matches = durStr.match(/(\d+)/);
      return matches ? parseInt(matches[0], 10) : 30;
    };

    // 1. Get Service Duration
    // Service is passed as name string in body based on schema, but we need the document
    // We should find by name AND branchId to be safe, or just name if unique
    const serviceDoc = await Service.findOne({ name: service, branchId });
    const duration = serviceDoc ? parseDuration(serviceDoc.duration) : 30;

    const newStart = parseTime(time);
    const newEnd = newStart + duration;

    // 2. Check Staff Availability (if specific staff selected)
    if (staff && staff !== "Any") {
      // Find staff by ID or Name
      // Try to find by ID first, then Name
      let staffDoc = await Staff.findOne({ _id: staff, branchId }).catch(() => null);
      if (!staffDoc) {
        staffDoc = await Staff.findOne({ name: staff, branchId });
      }

      if (staffDoc) {
        // A. Check Working Days
        const appointmentDate = new Date(date);
        const dayName = appointmentDate.toLocaleDateString('en-US', { weekday: 'short' });
        if (staffDoc.workingDays && !staffDoc.workingDays.includes(dayName)) {
          return res.status(400).json({ message: `${staff} is not working on ${dayName}` });
        }

        // B. Check Working Hours
        if (staffDoc.workingHours && staffDoc.workingHours.start && staffDoc.workingHours.end) {
          const workStart = parseTime(staffDoc.workingHours.start);
          const workEnd = parseTime(staffDoc.workingHours.end);
          if (newStart < workStart || newEnd > workEnd) {
            return res.status(400).json({ message: "Selected time is outside staff working hours" });
          }
        }

        // C. Check Overlaps with existing appointments for this staff
        const staffAppointments = await Appointment.find({
          branchId,
          date,
          staff: { $in: [staffDoc._id.toString(), staffDoc.name] }, // Check both ID and Name to be safe
          status: { $nin: ["Cancelled", "Rejected"] }
        });

        // We need durations of existing appointments to check overlaps
        // This is expensive if we don't store duration/endTime on Appointment
        // For now, we will fetch services for these appointments or use default
        // OPTIMIZATION: Fetch all relevant services once
        const serviceNames = [...new Set(staffAppointments.map(a => a.service))];
        const existingServices = await Service.find({ name: { $in: serviceNames }, branchId });
        const existingDurations = existingServices.reduce((acc, s) => {
          acc[s.name] = parseDuration(s.duration);
          return acc;
        }, {});

        const hasOverlap = staffAppointments.some(app => {
          const appStart = parseTime(app.time);
          const appDuration = existingDurations[app.service] || 30;
          const appEnd = appStart + appDuration;

          // Overlap condition: (StartA < EndB) and (EndA > StartB)
          return newStart < appEnd && newEnd > appStart;
        });

        if (hasOverlap) {
          return res.status(400).json({ message: "Staff is already booked for this time slot" });
        }
      }
    }

    // Find or Create Client
    let finalClientId = clientId;
    if (!finalClientId) {
      const client = await findOrCreateClient({
        name: customerName,
        email,
        phone,
        location,
        branchId,
      });
      finalClientId = client._id;
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
