import mongoose from "mongoose";
import dotenv from "dotenv";
import Staff from "./src/models/staff.model.js";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("MongoDB Connected");
    } catch (err) {
        console.error("DB Connection Error:", err);
        process.exit(1);
    }
};

const checkStaff = async () => {
    await connectDB();
    const phone = "+918433669535"; // The phone number from the screenshot

    try {
        const staff = await Staff.findOne({ phone });

        if (staff) {
            console.log("--- STAFF FOUND ---");
            console.log(`ID: ${staff._id}`);
            console.log(`Name: ${staff.name}`);
            console.log(`Role (Raw): '${staff.role}'`); // Wrapped in quotes to see whitespace
            console.log(`Status: ${staff.status}`);
            console.log("-------------------");

            // Simulation of the check in AuthRouter
            const isRoleMatch = staff.role && staff.role.toLowerCase() === "receptionist";
            console.log(`Does role match 'receptionist' (case-insensitive)? ${isRoleMatch}`);
        } else {
            console.log("--- NO STAFF FOUND ---");
            console.log(`Phone searched: ${phone}`);
        }
    } catch (error) {
        console.error("Error finding staff:", error);
    } finally {
        process.exit();
    }
};

checkStaff();
