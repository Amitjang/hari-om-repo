const Product = require("../models/product.model");
const Category = require("../models/category.model");
const fs = require("fs");
const path = require("path");

const asyncHandler = require("../middlewares/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

/* ================= GET ALL ================= */

exports.getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().populate("category");
  res.json(new ApiResponse(200, { products }));
});

/* ================= GET BY ID ================= */

exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.json(new ApiResponse(200, product));
});

/* ================= CREATE ================= */

exports.createProduct = asyncHandler(async (req, res) => {

  const { name, description, originalPrice, discount, stock, category } = req.body;

  if (!name || name.length < 3) {
    throw new ApiError(400, "Name must be at least 3 characters");
  }

  if (!description || description.length < 10) {
    throw new ApiError(400, "Description must be at least 10 characters");
  }

  if (!originalPrice || originalPrice <= 0) {
    throw new ApiError(400, "Valid price required");
  }

  if (!category) {
    throw new ApiError(400, "Category required");
  }

  if (!req.file) {
    throw new ApiError(400, "Image required");
  }

  const categoryExist = await Category.findById(category);

  if (!categoryExist) {
    throw new ApiError(400, "Invalid category");
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

  await Category.findByIdAndUpdate(category, {
    $inc: { productCount: 1 },
  });

  res.status(201).json(
    new ApiResponse(201, product, "Product created successfully")
  );
});

/* ================= UPDATE ================= */

exports.updateProduct = asyncHandler(async (req, res) => {

  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  let imagePath = product.image;

  if (req.file) {
    const oldImage = path.join(__dirname, "..", product.image);

    if (fs.existsSync(oldImage)) {
      fs.unlinkSync(oldImage);
    }

    imagePath = `/uploads/${req.file.filename}`;
  }

  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    { ...req.body, image: imagePath },
    { new: true }
  );

  res.json(new ApiResponse(200, updated, "Updated"));
});

/* ================= DELETE ================= */

exports.deleteProduct = asyncHandler(async (req, res) => {

  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product.image) {
    const img = path.join(__dirname, "..", product.image);

    if (fs.existsSync(img)) {
      fs.unlinkSync(img);
    }
  }

  await Product.findByIdAndDelete(req.params.id);

  res.json(new ApiResponse(200, null, "Deleted"));
});