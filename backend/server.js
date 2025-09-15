import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { PrismaClient } from "@prisma/client";
import shoppingRoutes from "./routes/shopping.js";
import chatRoutes from "./routes/chat.js";
import schemesRoutes from "./routes/schemes.js";
import usersRoutes from "./routes/users.js";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// --- Connect to Databases at the Top Level ---
// This code runs once when the serverless function starts
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("MongoDB connection error:", err));

prisma
  .$connect()
  .then(() => console.log("Connected to Azure SQL via Prisma!"))
  .catch((err) => console.error("Prisma connection error:", err));
// ---------------------------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// IMPORTANT: Update your CORS origin for production
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:8080", // Use an environment variable
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use("/api/products", shoppingRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/schemes", schemesRoutes);
app.use("/api/users", usersRoutes);

// Export the app for Vercel
export default app;
