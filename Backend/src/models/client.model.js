import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    // Reference to the Branch this client belongs to
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      default: "Unknown",
    },
    avatar: {
      type: String,
      default: function () {
        return this.name ? this.name.charAt(0).toUpperCase() : "C";
      },
    },
    totalVisits: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0, 
    },
    lastVisit: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

export const Client = mongoose.model("Client", clientSchema);
