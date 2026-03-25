const Product = require("../models/product.model");
const Category = require("../models/category.model");
const fs = require("fs");
const path = require("path");

// ✅ IMPORTS (MISSING THA)
const asyncHandler = require("../middlewares/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

/* ================= GET ALL ================= */

exports.getProducts = asyncHandler(async (req, res) => {

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

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  if (category) {
    query.category = category;
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
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

  res.json(
    new ApiResponse(200, {
      products,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    })
  );
});

/* ================= GET BY ID ================= */

exports.getProductById = asyncHandler(async (req, res) => {

  const product = await Product.findById(req.params.id)
    .populate("category", "name");

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.json(new ApiResponse(200, product));
});

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
    name: req.body.name,
    description: req.body.description,
    originalPrice,
    discount,
    price: Math.round(finalPrice),
    stock: Number(req.body.stock),
    category: category._id,
    image: `/uploads/${req.file.filename}`,
  });

  // 🔥 update category count
  await Category.findByIdAndUpdate(category._id, {
    $inc: { productCount: 1 },
  });

  res
    .status(201)
    .json(new ApiResponse(201, product, "Product created"));
});

/* ================= UPDATE ================= */

exports.updateProduct = asyncHandler(async (req, res) => {

  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
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

  if (req.body.originalPrice && req.body.discount !== undefined) {
    const discountAmount =
      (req.body.originalPrice * req.body.discount) / 100;

    req.body.price = Math.round(
      req.body.originalPrice - discountAmount
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

  res.json(new ApiResponse(200, updatedProduct, "Product updated"));
});

/* ================= DELETE ================= */

exports.deleteProduct = asyncHandler(async (req, res) => {

  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product.category) {
    await Category.findByIdAndUpdate(
      product.category,
      { $inc: { productCount: -1 } }
    );
  }

  if (product.image) {
    const imagePath = path.join(__dirname, "..", product.image);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  await Product.findByIdAndDelete(req.params.id);

  res.json(new ApiResponse(200, null, "Product deleted"));
});