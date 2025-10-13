import dotenv from "dotenv";
dotenv.config(); // ✅ Load env first — before anything else

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import router from "./routes";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Default Route
app.get("/", (_req, res) => {
  res.send("🚀 InnospaceX Backend Running...");
});

// Register all routes
app.use("/api", router);

export default app;
