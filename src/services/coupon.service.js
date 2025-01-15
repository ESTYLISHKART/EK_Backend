const Coupon = require("../models/coupon.model");
const Cart = require("../models/cart.model");

async function applyCoupon(userId, couponCode) {
  const coupon = await Coupon.findOne({ code: couponCode, isActive: true });

  if (!coupon) {
    throw new Error("Invalid or expired coupon.");
  }

  const currentDate = new Date();
  if (currentDate < coupon.validFrom || currentDate > coupon.validUntil) {
    throw new Error("Coupon is not valid for the current date");
  }

  if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
    throw new Error("Coupon usage limit reached");
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new Error("Cart not found for the user.");
  }

  const discount = (cart.totalPrice * coupon.discountPercentage) / 100;
  cart.couponcode = discount;
  cart.totalDiscountedPrice = cart.totalPrice - discount;
  cart.discounte = cart.totalPrice - cart.totalDiscountedPrice;
  await cart.save();

  coupon.usageCount += 1;
  await coupon.save();

  return cart;
}

// Fetch all available coupons
async function getAvailableCoupons() {
  const currentDate = new Date();
  return await Coupon.find({
    isActive: true,
    validFrom: { $lte: currentDate },
    validUntil: { $gte: currentDate },
  });
}

module.exports = { applyCoupon, getAvailableCoupons };
