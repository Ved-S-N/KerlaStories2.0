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
const PORT = 3000;

const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:8080",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use("/api/products", shoppingRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/schemes", schemesRoutes);
app.use("/api/users", usersRoutes);

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectMongoDB();

  try {
    await prisma.$connect();
    console.log("Connected to Azure SQL via Prisma!");
  } catch (err) {
    console.error("Prisma connection error:", err);
  }
});
