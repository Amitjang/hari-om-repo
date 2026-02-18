const  Order = require("../models/order.model");
const Product = require("../models/product.model");

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
    const { items, address, paymentMethod } = req.body;

    let orderItems = [];
    let totalAmount = 0;

    for (let item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }

      const subtotal = product.price * item.quantity;

      totalAmount += subtotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        subtotal: subtotal
      });
    }

    const order = await Order.create({
      customerId: req.body.customerId,
      customerName: req.body.customerName,
      items: orderItems,
      total: totalAmount,
      address,
      paymentMethod
    });

    res.status(201).json({
      success: true,
      data: order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/**
 * @desc    Get all orders (Admin)
 */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.product', 'name price image');

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
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
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
