import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { deals: true },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get product by id
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { deals: true },
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// Create new product
router.post("/", async (req, res) => {
  const { name, description, ratings, reviews, price, image, category } =
    req.body;
  try {
    const newProduct = await prisma.product.create({
      data: { name, description, ratings, reviews, price, image, category },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

// Update product by id
router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, description, ratings, reviews, price, image, category } =
    req.body;
  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { name, description, ratings, reviews, price, image, category },
    });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Delete product by id
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.product.delete({ where: { id } });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Get all deals
router.get("/deals", async (req, res) => {
  try {
    const deals = await prisma.deal.findMany({
      include: { product: true },
    });
    res.json(deals);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch deals" });
  }
});

// Get deal by id
router.get("/deals/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const deal = await prisma.deal.findUnique({
      where: { id },
      include: { product: true },
    });
    if (!deal) {
      return res.status(404).json({ error: "Deal not found" });
    }
    res.json(deal);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch deal" });
  }
});

// Create new deal
router.post("/deals", async (req, res) => {
  const { productId, title, discount, validTill } = req.body;
  try {
    const newDeal = await prisma.deal.create({
      data: { productId, title, discount, validTill: new Date(validTill) },
    });
    res.status(201).json(newDeal);
  } catch (error) {
    res.status(500).json({ error: "Failed to create deal" });
  }
});

// Update deal by id
router.put("/deals/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { productId, title, discount, validTill } = req.body;
  try {
    const updatedDeal = await prisma.deal.update({
      where: { id },
      data: { productId, title, discount, validTill: new Date(validTill) },
    });
    res.json(updatedDeal);
  } catch (error) {
    res.status(500).json({ error: "Failed to update deal" });
  }
});

// Delete deal by id
router.delete("/deals/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.deal.delete({ where: { id } });
    res.json({ message: "Deal deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete deal" });
  }
});

export default router;
