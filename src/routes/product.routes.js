const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");

const {
  createProduct,
  getAllProducts,
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
router.get("/getAllProducts", getAllProducts);

// Get single product
router.get("/getProductById/:id", getProductById);

// Update product (with image upload)
router.put("/updateProduct/:id", upload.single("image"), updateProduct);

// Delete product
router.delete("/deleteProduct/:id", deleteProduct);

module.exports = router;
