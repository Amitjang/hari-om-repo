const Product = require("../models/product.model");
const Category = require("../models/category.model");

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
      await Category.findByIdAndUpdate(
      req.body.category,
      { $inc: { productCount: 1 } }
    );
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); 
    if (!product) {
      return res.status(200).json({ error: "Product not found" });
    }
    res.status(200).json({status: "success", data: product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } };
  exports.updateProduct = async (req, res) => {try{
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    } res.status(200).json({status: "success", data: product });
  } catch (error) {
    res.status(500).json({ error: error.message });   }
  };
  exports.deleteProduct = async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id); 
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      } res.status(200).json({status: "success", message: "Product deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });   } };