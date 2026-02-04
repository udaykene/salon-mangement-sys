import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import AuthRouter from "./src/routes/AuthRouter.js";
import "./src/db/index.js";

const app = express();
const PORT = process.env.PORT || 3000;
// Change your CORS config to this:
// app.use(cors({
//   origin: ["http://localhost:3000", "http://127.0.0.1:5173"],
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Added OPTIONS explicitly
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));

app.use(
  session({
    secret: "salon_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // true only with HTTPS
    },
  }),
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use(cookieParser());

app.use("/auth", AuthRouter);

app.get("/ping", (req, res) => {
  res.send("PONG");
});

app.listen(PORT, () => {
  console.log("Server is running on:", PORT);
});
