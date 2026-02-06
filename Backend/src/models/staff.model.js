import mongoose from "mongoose";
const staffSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
      index: true,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    phone: {
      type: String,
      required: true,
      index: true,
    },
    email: String,
    password: String,
    role: {
      type: String,
      default: "staff",
    },
    specialization: [String], // Form string will be converted to this array
    salary: Number,
    commission: Number,
    workingDays: [String],
    workingHours: {
      start: String, // Matches "Working Hours Start" in form
      end: String, // Matches "Working Hours End" in form
    },
    // CHANGED: Supports "active", "on-leave", and "inactive" from your UI
    status: {
      type: String,
      enum: ["active", "on-leave", "inactive"],
      default: "active",
    },
    joiningDate: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

staffSchema.index({ ownerId: 1, phone: 1 }, { unique: true });

export default mongoose.model("Staff", staffSchema);
