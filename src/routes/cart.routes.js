const express = require("express");
const router = express.Router();

const {
  getCart,
  addToCart,
  updateCartItem,
  clearCart,
} = require("../controllers/cart.controller");

/* ================= CART ROUTES ================= */

// Get cart by userId
router.get("/getCart/:userId", getCart);

// Add item to cart
router.post("/addToCart", addToCart);

// Update item quantity
router.put("/update/:productId", updateCartItem);

// Clear cart by userId
router.delete("/clear/:userId", clearCart);

module.exports = router;