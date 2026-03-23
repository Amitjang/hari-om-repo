const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

// ✅ CREATE
router.post(
  "/createProduct",
  upload.single("image"),
  createProduct
);

// बाकी routes
router.get("/getAllProducts", getProducts);
router.get("/getProductById/:id", getProductById);
router.put("/updateProduct/:id", upload.single("image"), updateProduct);
router.delete("/deleteProduct/:id", deleteProduct);

module.exports = router;