const  Order = require("../models/order.model");
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");
const { sendAdminOrderMessage } = require("../services/whatapp.services");
/**
 * @desc    Create order
 */
// exports.createOrder = async (req, res) => {
//   try {
//     const order = new Order(req.body);
//     await order.save();
//     res.status(201).json({
//       success: true,
//       data: order
//     });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };
exports.createOrder = async (req, res) => {
  try {
    const { userId, selectedProductIds, shippingAddress, paymentMethod } =
      req.body;

    if (!userId || !selectedProductIds || selectedProductIds.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product"
    );

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Filter only selected items
    const selectedItems = cart.items.filter((item) =>
      selectedProductIds.includes(item.product._id.toString())
    );

    if (selectedItems.length === 0) {
      return res.status(400).json({ message: "No items selected" });
    }

    let subtotal = 0;

    const orderItems = [];

    for (const item of selectedItems) {
      const product = item.product;

      // 🔥 STOCK VALIDATION
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `${product.name} has only ${product.stock} items left`,
        });
      }

      subtotal += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });

      // 🔥 REDUCE STOCK
      product.stock -= item.quantity;
      await product.save();
    }

    const deliveryFee = subtotal >= 499 ? 0 : 49;
    const total = subtotal + deliveryFee;

    // 🔥 CREATE ORDER
  const order = await Order.create({
  user: userId,
  items: orderItems,
  shippingAddress,
  paymentMethod,
  subtotal,
  deliveryFee,
  total,
});

// 🔥 SEND WHATSAPP MESSAGE TO ADMIN
await sendAdminOrderMessage(order);

    // 🔥 REMOVE PURCHASED ITEMS FROM CART
    cart.items = cart.items.filter(
      (item) =>
        !selectedProductIds.includes(item.product._id.toString())
    );

    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all orders (Admin)
 */
exports.getAllOrders = async (req, res) => {
  try {
    // Query params
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    // Filter (optional future use)
    const filter = {};

    // Fetch orders
    const orders = await Order.find(filter)
      .populate("items.product", "name price image")
      .sort({ createdAt: -1 }) // 🔥 Recent first 
      .skip(skip)// Pagination
      .limit(limit);

    const totalOrders = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      total: totalOrders,
      page,
      totalPages: Math.ceil(totalOrders / limit),
      data: orders,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/**
 * @desc    Get orders by customer
 */
exports.getOrdersByCustomer = async (req, res) => {
  try {
    const orders = await Order.find({
      customerId: req.params.customerId
    }).populate('items.product');

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update order status
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 🚫 If already delivered, cannot cancel
    if (order.status === "delivered" && status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Delivered order cannot be cancelled",
      });
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.json({
      success: true,
      data: order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // ❌ Block deletion if not cancelled
    if (order.orderStatus !== "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Only cancelled orders can be deleted"
      });
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
      message: "Order deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
exports.getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenueData = await Order.aggregate([
      { $match: { orderStatus: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    const totalRevenue =
      totalRevenueData.length > 0 ? totalRevenueData[0].total : 0;

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const totalProducts = await Product.countDocuments();

    res.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalRevenue,
        recentOrders,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};