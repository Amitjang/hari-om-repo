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

    // Search
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Category
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
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= CREATE ================= */

exports.createProduct = asyncHandler(async (req, res) => {

  if (!req.file) {
    throw new ApiError(400, "Image required");
  }

  const category = await Category.findById(req.body.category);
  if (!category) {
    throw new ApiError(400, "Invalid category");
  }

  const originalPrice = Number(req.body.originalPrice);
  const discount = Number(req.body.discount || 0);

  const finalPrice =
    originalPrice - (originalPrice * discount) / 100;

  const product = await Product.create({
    ...req.body,
    price: Math.round(finalPrice),
    image: `/uploads/${req.file.filename}`,
  });

  await Category.findByIdAndUpdate(category._id, {
    $inc: { productCount: 1 },
  });

  res
    .status(201)
    .json(new ApiResponse(201, product, "Product created"));
});
/* ================= UPDATE ================= */

exports.updateProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let imagePath = product.image;

    // Image update
    if (req.file) {

      if (product.image) {
        const oldImage = path.join(__dirname, "..", product.image);

        if (fs.existsSync(oldImage)) {
          fs.unlinkSync(oldImage);
        }
      }

      imagePath = `/uploads/${req.file.filename}`;
    }

    // 🔥 Discount calculation
    if (req.body.originalPrice && req.body.discount !== undefined) {
      const discountAmount =
        (req.body.originalPrice * req.body.discount) / 100;

      req.body.price = Math.round(
        req.body.originalPrice - discountAmount
      );
    }

    const oldCategory = product.category?.toString();
    const newCategory = req.body.category;

    // Category count update
    if (newCategory && oldCategory !== newCategory) {

      await Category.findByIdAndUpdate(
        oldCategory,
        { $inc: { productCount: -1 } }
      );

      await Category.findByIdAndUpdate(
        newCategory,
        { $inc: { productCount: 1 } }
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        image: imagePath,
      },
      { new: true }
    );

    res.json({
      success: true,
      data: updatedProduct,
    });

  } catch (error) {
    console.log("UPDATE ERROR:", error);
    res.status(500).json({
      error: error.message,
    });
  }
};

/* ================= DELETE ================= */

exports.deleteProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Decrease category count
    if (product.category) {
      await Category.findByIdAndUpdate(
        product.category,
        { $inc: { productCount: -1 } }
      );
    }

    // Delete image
    if (product.image) {
      const imagePath = path.join(__dirname, "..", product.image);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {
    console.log("DELETE ERROR:", error);
    res.status(500).json({
      error: error.message,
    });
  }
};