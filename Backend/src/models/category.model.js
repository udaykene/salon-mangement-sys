import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true },
);

// Prevent duplicate categories in the same branch
categorySchema.index({ branchId: 1, name: 1 }, { unique: true });

export default mongoose.model("Category", categorySchema);
