import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
    {
        customerName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
        },
        service: {
            type: String,
            required: true,
        },
        staff: {
            type: String, // Optional, can be "Any" or specific staff ID/Name
            default: "Any",
        },
        date: {
            type: String, // Storing as string YYYY-MM-DD for simplicity, or Date object
            required: true,
        },
        time: {
            type: String, // HH:MM AM/PM
            required: true,
        },
        notes: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
            default: "Pending",
        },
    },
    { timestamps: true }
);

export const Appointment = mongoose.model("Appointment", appointmentSchema);
