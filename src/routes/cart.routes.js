const express = require("express");
const authenticate = require("../middleware/authenticat.js");
const router = express.Router();
const cartController = require("../controllers/cart.controller.js");
const couponRoutes = require("./coupon.routes.js");

// GET: /api/cart
router.get("/", authenticate, cartController.findUserCart);

// PUT: /api/cart/add
router.put("/add", authenticate, cartController.addItemToCart);

// PUT: /api/cart/update
router.put("/update", authenticate, cartController.updateCart);

// router.use("/coupons", couponRoutes);

module.exports = router;
