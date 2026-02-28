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
router.get("/:userId", getCart);

// Add item to cart
router.post("/", addToCart);

// Update item quantity
router.put("/:productId", updateCartItem);

// Clear cart by userId
router.delete("/:userId", clearCart);

module.exports = router;