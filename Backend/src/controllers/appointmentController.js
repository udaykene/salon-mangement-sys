import { Appointment } from "../models/Appointment.js";

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
        const appointments = await Appointment.find().sort({ createdAt: -1 });
        res.status(200).json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Server error while fetching appointments" });
    }
};

export const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const appointment = await Appointment.findByIdAndUpdate(
            id,
            { status },
            { new: true }
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
