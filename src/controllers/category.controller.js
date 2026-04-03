const Category = require("../models/category.model");
const Product = require("../models/product.model");
const cloudinary = require("cloudinary").v2;

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
      return res.status(404).json({
        error: "Category not found",
      });
    }

    res.json({
      success: true,
      data: category,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= CREATE ================= */

exports.createCategory = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "Image is required",
      });
    }

    const category = await Category.create({
      name: req.body.name,

      // ✅ CLOUDINARY
      image: req.file.path,
      imagePublicId: req.file.filename,
    });

    res.status(201).json({
      success: true,
      data: category,
    });

  } catch (error) {
    console.log("CREATE CATEGORY ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ================= UPDATE ================= */

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        error: "Category not found",
      });
    }

    let imageUrl = category.image;
    let imagePublicId = category.imagePublicId;

    // ✅ If new image uploaded
    if (req.file) {
      // 🔥 Delete old image from Cloudinary
      if (category.imagePublicId) {
        await cloudinary.uploader.destroy(category.imagePublicId);
      }

      imageUrl = req.file.path;
      imagePublicId = req.file.filename;
    }

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        image: imageUrl,
        imagePublicId,
      },
      { new: true }
    );

    res.json({
      success: true,
      data: updated,
    });

  } catch (error) {
    console.log("UPDATE CATEGORY ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ================= DELETE ================= */

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        error: "Category not found",
      });
    }

    const productsCount = await Product.countDocuments({
      category: req.params.id,
    });

    if (productsCount > 0) {
      return res.status(400).json({
        error: "Cannot delete category. Products exist in this category.",
      });
    }

    // 🔥 Delete image from Cloudinary
    if (category.imagePublicId) {
      await cloudinary.uploader.destroy(category.imagePublicId);
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