const mongoose = require('mongoose');

exports.productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100
    },
    description: {
      type: String,
      required: true,
      minlength: 10
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    originalPrice: {
      type: Number,
      min: 0
    },
    discount: {
      type: Number,
      min: 0,
      max: 100
    },
    image: {
      type: String,
      required: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    inStock: {
      type: Boolean,
      default: true
    },
    prescriptionRequired: {
      type: Boolean,
      default: false
    },
    usage: {
      type: String
    },
    safetyInfo: {
      type: String
    }
  },
  { timestamps: true }
);

// productSchema.index({ name: 'text', description: 'text' });

// export default mongoose.model('Product', productSchema);
module.exports = mongoose.model('Product', exports.productSchema);