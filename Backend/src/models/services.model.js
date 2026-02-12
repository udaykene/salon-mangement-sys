import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    // Linking to the Branch
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
      index: true, // Speeds up queries when fetching services for a specific branch
    },
    
    // Core Service Data
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    category: { 
      type: String, 
      required: true,
      enum: ["Hair", "Makeup", "Spa", "Nails"] 
    },
    desc: { type: String },
    
    // Pricing & Logistics
    price: { type: Number, required: true }, // Changed to Number for calculations
    duration: { type: String, required: true }, // e.g., "45 min"
    
    // Visuals (matches your Tailwind UI)
    icon: { type: String, default: "ri-scissors-2-line" },
    gradient: { type: String, default: "from-rose-500 to-pink-500" },
    
    // Metrics
    clients: { type: Number, default: 0 },
    
    
    // Status
    status: { 
      type: String, 
      enum: ["active", "inactive"], 
      default: "active" 
    },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);