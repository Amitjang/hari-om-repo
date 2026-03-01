const Product = require("../models/product.model");
const Category = require("../models/category.model");
const fs = require("fs");
const path = require("path");

/* ================= GET ALL ================= */

exports.getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 8,
      category,
      search,
      minPrice,
      maxPrice,
      sort,
    } = req.query;

    const query = {};

    // Search filter
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sorting
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
      success: true,
      data: products,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET BY ID ================= */

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name");

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ success: true, data: product });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= CREATE ================= */

exports.createProduct = async (req, res) => {
  try {
    const imagePath = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    const product = await Product.create({
      ...req.body,
      image: imagePath,
    });

    res.status(201).json({
      success: true,
      data: product,
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

/* ================= UPDATE ================= */

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let imagePath = product.image;

    if (req.file) {
      if (product.image) {
        const oldImage = path.join(__dirname, "..", product.image);
        if (fs.existsSync(oldImage)) {
          fs.unlinkSync(oldImage);
        }
      }

      imagePath = `/uploads/${req.file.filename}`;
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        image: imagePath,
      },
      { new: true }
    );

    res.json({ success: true, data: updated });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ================= DELETE ================= */

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.image) {
      const imagePath = path.join(__dirname, "..", product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Product deleted" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};