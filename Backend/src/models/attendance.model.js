import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
    {
        staffId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Staff",
            required: true,
            index: true,
        },
        branchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Branch",
            required: true,
            index: true,
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Owner",
            required: true,
            index: true,
        },
        date: {
            type: String, // stored as "YYYY-MM-DD"
            required: true,
        },
        status: {
            type: String,
            enum: ["present", "absent", "on-leave"],
            default: "present",
        },
    },
    { timestamps: true }
);

// Prevent duplicate attendance entries for the same staff on the same date
attendanceSchema.index({ staffId: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);
