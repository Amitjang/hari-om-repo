const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders, getOrdersByCustomer, updateOrderStatus} = require("../controllers/order.controller");
// ✅ Test route
router.get("/test", (req, res) => {
  res.send("Order API working");
}); 
// ✅ Create order
router.post("/createOrder", createOrder);
// ✅ Get all orders (Admin)
router.get("/getAllOrders", getAllOrders);
router.get('/getOrdersByCustomer/:customerId', getOrdersByCustomer);
router.put('/updateOrderStatus/:id', updateOrderStatus);
module.exports = router;
