const express = require("express");
const router = express.Router();

const adminProtect = require("../middlewares/admin.middleware");
const { protect } = require("../middlewares/auth.middleware");
const {
  getCart,
  addToCart,
  updateCartItem,
  clearCart,
} = require("../controllers/cart.controller");

/* ================= CART ROUTES ================= */

// Get current user's cart
router.get("/getCarts", protect, getCart);

// Add item to cart
router.post("/addToCart", protect, addToCart);

// Update cart item quantity
router.put("/update/:productId", protect, updateCartItem);

// Clear entire cart
router.delete("/clear", protect, clearCart);

module.exports = router;