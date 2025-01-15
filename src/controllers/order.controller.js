const orderService = require("../services/order.service.js");
const mongoose = require("mongoose");

function validateAddress(address) {
  const { street, city, state, zipCode, phone } = address;

  if (!street || !city || !state || !zipCode || !phone) {
    throw new Error(
      "All address fields (street, city, state, zipCode, phone) are required"
    );
  }

  if (!/^\d{10}$/.test(phone)) {
    throw new Error("Phone number must be a valid 10-digit number");
  }
  return true;
}

const createOrder = async (req, res) => {
  try {
    if (!req.body.address) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    validateAddress(req.body.address);

    const createdOrder = await orderService.createOrder(
      req.user,
      req.body.address
    );
    return res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Error creating order:", error.message);
    return res.status(error.message.includes("required") ? 400 : 500).json({
      message: error.message,
    });
  }
};

const findOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await orderService.findOrderById(id);
    if (!order) {
      // If no order is found, return a 404 error
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error.message);
    return res.status(500).json({ message: "Failed to fetch order" });
  }
};

const orderHistory = async (req, res) => {
  const user = req.user;
  const { status } = req.query; // Get the status from query params if provided

  try {
    let query = { user: user._id }; // Always filter by user

    if (status) {
      query.orderStatus = status; // Add the status filter if provided
    }

    let orders = await orderService.usersOrderHistory(query); // Await the promise from the service

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    return res.status(200).json(orders); // Return the orders as JSON
  } catch (error) {
    console.error("Error fetching user order history:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, findOrderById, orderHistory };
