import mongoose from "mongoose";
import  bcrypt  from 'bcryptjs';
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
  },
  { timestamps: true }
);

// Automatically hash password before saving to DB
ownerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
});

export default mongoose.model("Owner", ownerSchema);
