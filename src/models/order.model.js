const mongoose = require("mongoose");
const CartItemSchema = require("./cartItem.model").schema;

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: false
    },
    customerName: {
      type: String,
      required: true
    },
    items: {
      type: [CartItemSchema],
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    address: {
      type: String,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'upi', 'wallet'],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
