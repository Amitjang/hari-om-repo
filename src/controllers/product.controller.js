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

    // ✅ FIX: INCREASE CATEGORY COUNT
    await Category.findByIdAndUpdate(category, {
      $inc: { productCount: 1 },
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
    const {
      page = 1,
      limit = 8,
      category,
      search,
      sort,
    } = req.query;

    const query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    let sortOption = {};
    if (sort === "low") sortOption.price = 1;
    if (sort === "high") sortOption.price = -1;
    if (sort === "new") sortOption.createdAt = -1;

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .populate("category")
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({
      products,
      total,
      totalPages: Math.ceil(total / limit),
      page: Number(page),
    });

  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err);
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

    // 🔥 PRICE FIX
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
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Not found" });
    }

    // ✅ FIX: DECREASE CATEGORY COUNT
    if (product.category) {
      await Category.findByIdAndUpdate(product.category, {
        $inc: { productCount: -1 },
      });
    }

    // OPTIONAL: DELETE IMAGE
    if (product.image) {
      const imagePath = path.join(__dirname, "..", product.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

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