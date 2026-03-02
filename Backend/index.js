import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import "./src/db/index.js";
import AuthRouter from "./src/routes/AuthRouter.js";
import BranchRouter from "./src/routes/BranchRouter.js";
import StaffRouter from "./src/routes/StaffRouter.js";
import MongoStore from "connect-mongo";
import profileRoutes from "./src/routes/profile.routes.js";
import subscriptionRoutes from "./src/routes/subscription.routes.js";
import ServicesRouter from "./src/routes/ServicesRouter.js";
import CategoryRouter from "./src/routes/CategoryRouter.js";
import AttendanceRouter from "./src/routes/AttendanceRouter.js";
import AppointmentRouter from "./src/routes/AppointmentRouter.js";
import ClientRouter from "./src/routes/clientRoutes.js";
import ReportRouter from "./src/routes/reportRoutes.js";
import ExpenseRouter from "./src/routes/expenseRoutes.js";
import InventoryRouter from "./src/routes/inventory.routes.js";
import CustomerAuthRouter from "./src/routes/CustomerAuthRouter.js";

const app = express();
const PORT = Number(process.env.PORT || 3000);
const MAX_PORT_TRIES = Number(process.env.PORT_FALLBACK_ATTEMPTS || 20);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const runtimeDir = path.resolve(__dirname, "../.runtime");
const runtimeFile = path.join(runtimeDir, "backend-port.json");

const configuredOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
const allowLocalhostOrigins = process.env.ALLOW_LOCALHOST_CORS !== "false";
const isLocalhostOrigin = (origin) =>
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

// 1. CORS MUST BE FIRST
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (
        configuredOrigins.includes(origin) ||
        (allowLocalhostOrigins && isLocalhostOrigin(origin))
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);

// 2. PARSERS NEXT
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Cookie parser should be before session

// 3. SESSION BEFORE ROUTES
const sessionStore = MongoStore.create({ mongoUrl: process.env.MONGO_DB_URL });

const sessionOptions = (cookieName) => ({
  name: cookieName,
  secret: process.env.SESSION_SECRET || "salon_secret",
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "lax",
  },
});

const customerSessionMiddleware = session(sessionOptions("customer.sid"));
const adminSessionMiddleware = session(sessionOptions("admin.sid"));

// Customer app gets a separate session cookie to avoid role/session clobbering
app.use("/customer-auth", customerSessionMiddleware);
// Admin/receptionist app session (excluded for customer-auth routes)
app.use((req, res, next) => {
  if (req.path.startsWith("/customer-auth")) return next();
  return adminSessionMiddleware(req, res, next);
});

// 4. STATIC FILES
app.use(express.static("public"));

// 5. ROUTES LAST
app.use("/auth", AuthRouter);
app.use("/api/branches", BranchRouter);
app.use("/api/staff", StaffRouter);
app.use("/api/profile", profileRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/services", ServicesRouter);
app.use("/api/categories", CategoryRouter);
app.use("/api/attendance", AttendanceRouter);
app.use("/api/appointments", AppointmentRouter);
app.use("/api/clients", ClientRouter);
app.use("/api/reports", ReportRouter);
app.use("/api/expenses", ExpenseRouter);
app.use("/api/inventory", InventoryRouter);
app.use("/customer-auth", CustomerAuthRouter);

app.get("/ping", (req, res) => {
  res.send("PONG");
});

const startServer = (port, attempt = 0) => {
  const server = app.listen(port, () => {
    console.log("Server is running on:", port);
    try {
      fs.mkdirSync(runtimeDir, { recursive: true });
      fs.writeFileSync(runtimeFile, JSON.stringify({ port }, null, 2));
    } catch (err) {
      console.warn("Failed to write runtime port file:", err.message);
    }
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE" && attempt < MAX_PORT_TRIES) {
      const nextPort = port + 1;
      console.warn(
        `Port ${port} is in use. Retrying with port ${nextPort}...`,
      );
      startServer(nextPort, attempt + 1);
      return;
    }
    console.error("Failed to start server:", error);
    process.exit(1);
  });
};

startServer(PORT);
