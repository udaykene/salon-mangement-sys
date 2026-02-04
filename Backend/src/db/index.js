import mongoose from "mongoose";

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log("MongoDB Connected...");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err);
    process.exit(1); // Shuts down the process if DB fails
  });
