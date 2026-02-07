import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import "./src/db/index.js";
import AuthRouter from "./src/routes/AuthRouter.js";
import BranchRouter from './src/routes/BranchRouter.js'
import StaffRouter from './src/routes/StaffRouter.js'
import MongoStore from 'connect-mongo';

const app = express();
const PORT = process.env.PORT || 3000;

// 1. CORS MUST BE FIRST
app.use(cors({
  origin: "http://localhost:5173", // Use your exact frontend URL
  credentials: true
}));

// 2. PARSERS NEXT
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Cookie parser should be before session

// 3. SESSION BEFORE ROUTES
app.use(session({
  secret: 'salon_secret',
  resave: false,
  saveUninitialized: false,
  store:MongoStore.create({ mongoUrl: process.env.MONGO_DB_URL }), // Saves session to DB
  cookie: { 
    secure: false, 
    httpOnly: true, 
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

// 4. STATIC FILES
app.use(express.static("public"));

// 5. ROUTES LAST
app.use("/auth", AuthRouter);
app.use("/api/branches", BranchRouter);
app.use("/api/staff", StaffRouter);

app.get("/ping", (req, res) => {
  res.send("PONG");
});

app.listen(PORT, () => {
  console.log("Server is running on:", PORT);
});