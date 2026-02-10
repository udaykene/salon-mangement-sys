import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const ownerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    branches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
      },
    ],
    isActive: { type: Boolean, default: true },
    // 🆕 Subscription fields
    subscription: {
      plan: {
        type: String,
        enum: ["basic", "standard", "premium"],
        default: "basic",
      },
      maxBranches: {
        type: Number,
        default: 1,
      },
      startDate: {
        type: Date,
        default: Date.now,
      },
      // You can add expiryDate later when implementing payment
      // expiryDate: { type: Date }
    },
  },
  { timestamps: true }
);

// Automatically hash password before saving to DB
ownerSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model("Owner", ownerSchema);