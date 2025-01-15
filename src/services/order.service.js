const Address = require("../models/address.model.js");
const Order = require("../models/order.model.js");
const OrderItem = require("../models/orderItems.js");
const mongoose = require("mongoose");
const Product = require("../models/product.model"); // Ensure it's the correct path
const cartService = require("../services/cart.service.js");
const { query } = require("express");

async function createOrder(user, shippAddress) {
  let address;

  if (shippAddress._id) {
    address = await Address.findById(shippAddress._id);
    if (!address) {
      throw new Error("Address not found");
    }
  } else {
    address = new Address(shippAddress);
    address.user = user._id;
    await address.save();

    // Only push to user addresses if the user model has addresses array
    if (user.addresses) {
      user.addresses.push(address._id);
      await user.save();
    }
  }

  const cart = await cartService.findUserCart(user._id);

  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  const orderItems = [];

  for (const item of cart.cartItems) {
    const orderItem = new OrderItem({
      price: item.price,
      product: item.product,
      quantity: item.quantity,
      size: item.size,
      userId: item.userId,
      discountedPrice: item.discountedPrice,
    });

    const createdOrderItem = await orderItem.save();
    orderItems.push(createdOrderItem._id);
  }

  const createdOrder = new Order({
    user: user._id,
    orderItems,
    totalPrice: cart.totalPrice,
    totalDiscountedPrice: cart.totalDiscountedPrice,
    discounte: cart.discounte, // Use 0 if `cart.discount` is undefined
    totalItem: cart.totalItem,
    shippingAddress: {
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      phone: address.phone,
    },
    orderDate: new Date(),
    orderStatus: "PENDING",
    "paymentDetails.status": "PENDING",
  });

  const savedOrder = await createdOrder.save();

  // Clear the cart after successful order creation
  // await cartService.clearCart(user._id);

  return savedOrder;
}

async function placedOrder(orderId) {
  const order = await findOrderById(orderId);
  order.orderStatus = "PLACED";
  order.paymentDetails.status = "COMPLETED";
  return await order.save();
}

async function confirmedOrder(orderId) {
  const order = await findOrderById(orderId);
  order.orderStatus = "CONFIRMED";
  return await order.save();
}

async function shipOrder(orderId) {
  const order = await findOrderById(orderId);
  order.orderStatus = "SHIPPED";
  return await order.save();
}

async function deliveredOrder(orderId) {
  const order = await findOrderById(orderId);
  order.orderStatus = "DELIVERED";
  return await order.save();
}

async function cancelledOrder(orderId) {
  const order = await findOrderById(orderId);
  order.orderStatus = "CANCELLED"; // Assuming OrderStatus is a string enum or a valid string value
  return await order.save();
}

async function findOrderById(orderId) {
  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new Error("Invalid Order ID"); // HTTP 400 Bad Request
  }

  try {
    // Fetch order by ID and populate related data
    const order = await Order.findById(orderId)
      .populate("user") // Populate user details
      .populate({
        path: "orderItems", // Populate order items
        populate: {
          path: "product", // Populate related product details
          model: "Product",
        },
      })
      .populate("shippingAddress"); // Assuming shippingAddress is a reference to the Address model

    // If no order is found, throw an error
    if (!order) {
      throw new Error("Order not found"); // HTTP 404 Not Found
    }

    return order; // Return the populated order
  } catch (error) {
    // Handle unexpected errors
    throw new Error("Database error while fetching the order");
  }
}

async function usersOrderHistory(query) {
  try {
    const orders = await Order.find(query)
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
        },
      })
      .lean();

    return orders;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getAllOrders() {
  return await Order.find()
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
      },
    })
    .lean();
}

async function deleteOrder(orderId) {
  const order = await findOrderById(orderId);
  if (!order) throw new Error("order not found with id ", orderId);

  await Order.findByIdAndDelete(orderId);
}

module.exports = {
  createOrder,
  placedOrder,
  confirmedOrder,
  shipOrder,
  deliveredOrder,
  cancelledOrder,
  findOrderById,
  usersOrderHistory,
  getAllOrders,
  deleteOrder,
};
