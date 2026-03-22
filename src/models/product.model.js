const mongoose = require("mongoose");

exports.productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      minlength: 10,
    },

    originalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    image: {
      type: String,
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
    },

    prescriptionRequired: {
      type: Boolean,
      default: false,
    },

    usage: String,
    safetyInfo: String,
  },
  { timestamps: true }
);


// 🔥 AUTO CALCULATE PRICE
exports.productSchema.pre("save", function (next) {

  if (this.originalPrice && this.discount >= 0) {

    const discountAmount =
      (this.originalPrice * this.discount) / 100;

    this.price = Math.round(
      this.originalPrice - discountAmount
    );
  }

  next();
});

module.exports = mongoose.model("Product", exports.productSchema);