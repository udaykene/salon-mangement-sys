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

    password: String, // only if you allow password login (OTP recommended)

    role: {
      type: String,
      default: "staff",
    },

    specialization: [String],

    salary: Number,
    commission: Number,

    workingDays: [String],

    workingHours: {
      start: String,
      end: String,
    },

    isActive: { type: Boolean, default: true },

    joiningDate: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

staffSchema.index({ ownerId: 1, phone: 1 }, { unique: true });

export default mongoose.model("Staff", staffSchema);
