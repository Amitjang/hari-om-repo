const mongoose = require('mongoose');
const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: false
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  },
  { _id: false }
);

module.exports = mongoose.model('CartItem', cartItemSchema);
