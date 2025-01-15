const mongoose = require("mongoose");

// Define the shipping address schema
// const shippingAddressSchema = new mongoose.Schema({
//   street: {
//     type: String,
//     required: true,
//   },
//   city: {
//     type: String,
//     required: true,
//   },
//   state: {
//     type: String,
//     required: true,
//   },
//   zipCode: {
//     type: String,
//     required: true,
//   },
//   phone: {
//     type: String,
//     required: true,
//     match: [/^\d{10}$/, "Please provide a valid 10-digit phone number"],
//   },
// });

// Define the order schema
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
        required: true,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    totalDiscountedPrice: {
      type: Number,
      required: true,
    },
    discounte: {
      type: Number,
      required: true, // Ensure this is populated when creating an order
    },
    totalItem: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      phone: {
        type: String,
        required: true,
        match: [/^\d{10}$/, "Please provide a valid 10-digit phone number"],
      },
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    orderStatus: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },
    paymentDetails: {
      status: {
        type: String,
        enum: ["PENDING", "PAID", "FAILED"],
        default: "PENDING",
      },
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
