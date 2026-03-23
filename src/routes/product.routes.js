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

// 🔥 SAFE MULTER WRAPPER
const uploadSingle = (req, res, next) => {
  upload.single("image")(req, res, function (err) {
    if (err) {
      console.log("MULTER ERROR:", err);
      return res.status(400).json({
        error: err.message || "Image upload failed",
      });
    }
    next();
  });
};

// ✅ CREATE
router.post("/createProduct", uploadSingle, createProduct);

// ✅ UPDATE
router.put("/updateProduct/:id", uploadSingle, updateProduct);

// बाकी routes
router.get("/getAllProducts", getProducts);
router.get("/getProductById/:id", getProductById);
router.delete("/deleteProduct/:id", deleteProduct);

module.exports = router;