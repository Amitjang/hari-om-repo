const express = require("express");
const router = express.Router();

const {
  getCart,
  addToCart,
  updateCartItem,
  clearCart,
   removeCartItem,  
   removeMultipleItems
} = require("../controllers/cart.controller");

/* ================= CART ROUTES ================= */

// Get cart by userId
router.get("/getCart/:userId", getCart);

// Add item to cart
router.post("/addToCart", addToCart);

// Update item quantity
router.post("/remove-multiple", removeMultipleItems);
router.put("/update/:productId", updateCartItem);

// Clear cart by userId
router.delete("/clear/:userId", clearCart);
// Remove item from cart
router.delete("/item/:productId", removeCartItem);
module.exports = router;