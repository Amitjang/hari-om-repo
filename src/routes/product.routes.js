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

// ✅ SIMPLE & STABLE
router.post("/createProduct", upload.single("image"), createProduct);

router.put("/updateProduct/:id", upload.single("image"), updateProduct);

router.get("/getAllProducts", getProducts);
router.get("/getProductById/:id", getProductById);
router.delete("/deleteProduct/:id", deleteProduct);

module.exports = router;