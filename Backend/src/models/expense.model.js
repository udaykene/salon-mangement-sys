import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
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
    category: {
      type: String,
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: String, // Storing as YYYY-MM-DD string to match Appointment date format
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Expense", expenseSchema);
