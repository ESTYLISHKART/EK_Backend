const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  discountPercentage: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
  },
  validFrom: {
    type: Date,
    required: true,
  },
  validUntil: {
    type: Date,
    required: true,
  },
  usageLimit: {
    type: Number,
    default: 100,
    required: true,
  },
  usageCount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
