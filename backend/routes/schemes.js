import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// Get all schemes with optional filters
router.get("/", async (req, res) => {
  try {
    const { income, crop, region, q } = req.query;

    const filters = {};

    if (income) {
      filters.OR = [
        { income_limit: null }, // no income limit
        { income_limit: { gte: Number(income) } },
      ];
    }

    if (crop && crop !== "all") {
      filters.crop_type = crop;
    }

    if (region && region !== "all") {
      filters.region = region;
    }

    if (q) {
      filters.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    const schemes = await prisma.scheme.findMany({
      where: filters,
      orderBy: { createdAt: "desc" },
    });

    res.json(schemes);
  } catch (err) {
    console.error("Error fetching schemes:", err);
    res.status(500).json({ error: "Failed to fetch schemes" });
  }
});

// Get one scheme by ID
router.get("/:id", async (req, res) => {
  try {
    const scheme = await prisma.scheme.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!scheme) return res.status(404).json({ error: "Scheme not found" });
    res.json(scheme);
  } catch (err) {
    res.status(500).json({ error: "Error fetching scheme" });
  }
});

// Add new scheme
router.post("/", async (req, res) => {
  try {
    const { name, income_limit, crop_type, region, deadline, description } =
      req.body;

    const scheme = await prisma.scheme.create({
      data: {
        name,
        income_limit: income_limit === "none" ? null : Number(income_limit),
        crop_type,
        region,
        deadline,
        description,
      },
    });

    res.status(201).json(scheme);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
