const express = require("express");
const router = express.Router();

const cartService = require("../services/cart.service.js");



const findUserCart = async (req, res) => {
  try {
    const user = req.user;
    const cart = await cartService.findUserCart(user.id);
    res.status(200).json(cart);
  } catch (error) {
    // Handle error here and send appropriate response
    res.status(500).json({ message: "Failed to get user cart.", error: error.message });
  }
}

const updateCart = async (req, res) => {
  try {
    const user = req.user;
    const { couponcode } = req.body;

    // Ensure that couponcode is present
    if (!couponcode) {
      return res.status(400).json({ message: "Coupon code is required." });
    }

    // Call the updateCart function from cartService
    await cartService.updateCart(user.id, couponcode);

    // Send the updated cart back to the user as a response
    res.status(200).json({ message: "Cart updated successfully"});

  } catch (error) {
    console.error("Error updating cart:", error); // For debugging purposes
    res.status(500).json({ message: "Failed to update user cart.", error: error.message });
  }
};


const addItemToCart = async (req, res) => {
  try {
    const user = req.user;
    await cartService.addCartItem(user._id.toString(), req.body);

    res.status(202).json({ message: "Item Added To Cart Successfully", status: true });
  } catch (error) {
    // Handle error here and send appropriate response
    res.status(500).json({ message: "Failed to add item to cart.", error: error.message });
  }
}

module.exports = { findUserCart, addItemToCart, updateCart};