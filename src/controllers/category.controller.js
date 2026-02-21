const Category = require("../models/category.model");
const Product = require("../models/product.model");
const fs = require("fs");
const path = require("path");

/* ================= GET ALL ================= */

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= GET ONE ================= */

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ success: true, data: category });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= CREATE ================= */

exports.createCategory = async (req, res) => {
  try {
    const imagePath = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    const category = await Category.create({
      ...req.body,
      image: imagePath,
    });

    res.status(201).json({
      success: true,
      data: category,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= UPDATE ================= */

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    let imagePath = category.image;

    if (req.file) {
      if (category.image) {
        const oldImage = path.join(__dirname, "..", category.image);
        if (fs.existsSync(oldImage)) {
          fs.unlinkSync(oldImage);
        }
      }

      imagePath = `/uploads/${req.file.filename}`;
    }

    const updated = await Category.findByIdAndUpdate(
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



exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // 🔥 CHECK IF PRODUCTS EXIST
    const productsCount = await Product.countDocuments({
      category: req.params.id,
    });

    if (productsCount > 0) {
      return res.status(400).json({
        error: "Cannot delete category. Products exist in this category.",
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Category deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};