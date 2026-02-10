import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
      index: true,
    },

    name: { type: String, required: true },

    address: String,
    city: String,
    state: String,
    zipCode: String,

    phone: String,
    email: String,

    openingTime: String,
    closingTime: String,

    workingDays: [String], // ["Mon","Tue","Wed"]

    staffs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
      },
    ],

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Branch", branchSchema);
