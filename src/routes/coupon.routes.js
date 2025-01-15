const express = require("express");
const {
  getCoupons,
  createCoupon,
  applyCoupon,
  deleteCoupon,
} = require("../controllers/coupon.controller");
const authenticate = require("../middleware/authenticat");
const router = express.Router();

// Get available coupons
router.get("/", getCoupons);

// Admin: Create a new coupon
router.post("/", createCoupon);

// Apply a coupon to a cart
router.post("/apply", applyCoupon);

router.delete("/:couponId", deleteCoupon); // Delete a coupon by ID

module.exports = router;
