import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
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
    category: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    minStock: {
      type: Number,
      required: true,
      default: 10,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    supplier: {
      type: String,
      trim: true,
    },
    lastRestocked: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["in-stock", "low-stock", "out-of-stock"],
      default: "in-stock",
    },
  },
  { timestamps: true },
);

// Middleware to update status before saving
inventorySchema.pre("save", function () {
  if (this.quantity === 0) {
    this.status = "out-of-stock";
  } else if (this.quantity <= this.minStock) {
    this.status = "low-stock";
  } else {
    this.status = "in-stock";
  }
});

export default mongoose.model("Inventory", inventorySchema);
