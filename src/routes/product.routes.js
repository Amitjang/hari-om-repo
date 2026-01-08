const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductById,deleteProduct
,updateProduct
} = require("../controllers/product.controller");
// ✅ Test route
router.get("/test", (req, res) => {
  res.send("Product API working");
});

// ✅ Create product
router.post("/createProduct", createProduct);

// ✅ Get all products
router.get("/getAllProducts", getAllProducts);
router.get('/getProductById/:id', getProductById);
router.put('/updateProduct/:id', updateProduct);
router.delete('/deleteProduct/:id', deleteProduct);

module.exports = router;
