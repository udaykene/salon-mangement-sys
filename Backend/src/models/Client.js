import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
    {
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
            type: String, // Store single letter for avatar
            default: function () {
                return this.name ? this.name.charAt(0).toUpperCase() : "C";
            },
        },
        notes: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

export const Client = mongoose.model("Client", clientSchema);
