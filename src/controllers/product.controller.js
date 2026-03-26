const Product = require("../models/product.model");
const Category = require("../models/category.model");
const fs = require("fs");
const path = require("path");

/* ================= CREATE ================= */

exports.createProduct = async (req, res) => {
  try {
    const { name, description, originalPrice, discount, stock, category } = req.body;

    if (!name || name.length < 3) {
      return res.status(400).json({ message: "Name too short" });
    }

    if (!description || description.length < 10) {
      return res.status(400).json({ message: "Description min 10 chars" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    const cat = await Category.findById(category);
    if (!cat) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const priceNum = Number(originalPrice);
    const discountNum = Number(discount || 0);

    const finalPrice =
      priceNum - (priceNum * discountNum) / 100;

    const product = await Product.create({
      name,
      description,
      originalPrice: priceNum,
      discount: discountNum,
      price: Math.round(finalPrice),
      stock: Number(stock || 0),
      category,
      image: `/uploads/${req.file.filename}`,
    });

    res.status(201).json(product);

  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET ALL ================= */

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE ================= */

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Not found" });
    }

    let imagePath = product.image;

    if (req.file) {
      const oldImage = path.join(__dirname, "..", product.image);
      if (fs.existsSync(oldImage)) fs.unlinkSync(oldImage);

      imagePath = `/uploads/${req.file.filename}`;
    }

    // 🔥 FIX: RECALCULATE PRICE
    if (req.body.originalPrice) {
      const priceNum = Number(req.body.originalPrice);
      const discountNum = Number(req.body.discount || 0);

      req.body.price = Math.round(
        priceNum - (priceNum * discountNum) / 100
      );
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, image: imagePath },
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE ================= */

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET BY ID ================= */

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};