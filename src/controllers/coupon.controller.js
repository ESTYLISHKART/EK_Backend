const Coupon = require("../models/coupon.model");
const Cart = require("../models/cart.model");

// Get all active coupons
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({
      isActive: true,
      validUntil: { $gte: new Date() },
    });
    res.status(200).json({ coupons });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching coupons.", error: error.message });
  }
};

// Create a new coupon (Admin)
const createCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, validFrom, validUntil, usageLimit } =
      req.body;

    // Validate inputs
    if (
      !code ||
      !discountPercentage ||
      !validFrom ||
      !validUntil ||
      !usageLimit
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists." });
    }

    const coupon = new Coupon({
      code,
      discountPercentage,
      validFrom,
      validUntil,
      usageLimit,
    });
    await coupon.save();

    res.status(201).json({ message: "Coupon created successfully.", coupon });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating coupon.", error: error.message });
  }
};

// Apply a coupon to the user's cart
const applyCoupon = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.id) {
      return res.status(400).json({ message: "User authentication failed." });
    }

    const { couponCode } = req.body;

    if (!couponCode) {
      return res.status(400).json({ message: "Coupon code is required." });
    }

    // Validate the coupon
    const coupon = await Coupon.findOne({
      code: couponCode,
      isActive: true,
      validUntil: { $gte: new Date() },
    });

    if (!coupon) {
      return res.status(400).json({ message: "Invalid or expired coupon." });
    }

    if (coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({ message: "Coupon usage limit reached." });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ user: user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    // Check if coupon is already applied
    if (cart.appliedCoupon && cart.appliedCoupon === couponCode) {
      return res.status(400).json({ message: "Coupon already applied." });
    }

    // Calculate and apply the discount
    const discount = (cart.totalPrice * coupon.discountPercentage) / 100;
    cart.couponcode = discount;
    cart.totalDiscountedPrice = cart.totalPrice - discount;
    cart.discounte = cart.totalPrice - cart.totalDiscountedPrice;
    cart.appliedCoupon = couponCode; // Track applied coupon
    await cart.save();

    // Update coupon usage
    coupon.usageCount += 1;
    await coupon.save();

    res.status(200).json({
      message: "Coupon applied successfully.",
      cart,
    });
  } catch (error) {
    console.error("Error applying coupon:", error);
    res
      .status(500)
      .json({ message: "Error applying coupon.", error: error.message });
  }
};

// Delete a coupon (Admin)
const deleteCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;

    // Validate coupon ID
    if (!couponId) {
      return res.status(400).json({ message: "Coupon ID is required." });
    }

    // Find and delete the coupon
    const coupon = await Coupon.findByIdAndDelete(couponId);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found." });
    }

    res.status(200).json({ message: "Coupon deleted successfully." });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    res
      .status(500)
      .json({ message: "Error deleting coupon.", error: error.message });
  }
};

module.exports = { getCoupons, createCoupon, applyCoupon, deleteCoupon };
