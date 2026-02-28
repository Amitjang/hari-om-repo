const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

/* ================= ADD TO CART ================= */

exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    await cart.populate("items.product");

    res.status(200).json({
      success: true,
      data: cart,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= GET CART ================= */

exports.getCart = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "UserId required" });
    }

    const cart = await Cart.findOne({ user: userId })
      .populate("items.product");

    res.json({ success: true, data: cart });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= UPDATE CART ITEM ================= */

exports.updateCartItem = async (req, res) => {
  try {
    const { userId, quantity } = req.body;
    const { productId } = req.params;

    if (!userId || quantity === undefined) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (i) => i.product.toString() === productId
    );

    if (!item) return res.status(404).json({ message: "Item not found" });

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (i) => i.product.toString() !== productId
      );
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate("items.product");

    res.json({ success: true, data: cart });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= CLEAR CART ================= */

exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "UserId required" });
    }

    await Cart.findOneAndUpdate(
      { user: userId },
      { items: [] }
    );

    res.json({ success: true, message: "Cart cleared" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};