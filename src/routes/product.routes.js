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

/* ================= TEST ================= */

router.get("/test", (req, res) => {
  res.send("Product API working");
});

/* ================= REST STYLE ROUTES ================= */

// Create product (with image upload)
router.post("/createProduct", upload.single("image"), createProduct);

// Get all products
router.get("/getAllProducts", getProducts);

// Get single product
router.get("/getProductById/:id", getProductById);

// Update product (with image upload)
router.put("/updateProduct/:id", upload.single("image"), updateProduct);

// Delete product
router.delete("/deleteProduct/:id", deleteProduct);

module.exports = router;
