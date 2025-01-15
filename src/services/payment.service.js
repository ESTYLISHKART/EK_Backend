const {
  icici,
  ENC_KEY,
  SECURE_SECRET,
  BANKID,
  PASSCODE,
  MCC,
  RETURNURL,
} = require("../config/iciciClient");
const User = require("../models/user.model.js");
const Address = require("../models/address.model.js");
const orderService = require("../services/order.service.js");

const createPaymentLink = async (orderId) => {
  try {
    const order = await orderService.findOrderById(orderId);
    if (!order) throw new Error(`Order with ID ${orderId} not found`);

    const user = await User.findById(order.user).populate("addresses");
    if (!user) throw new Error("User not found");

    const address = user.addresses[0];
    if (!address) {
      throw new Error("User does not have a valid address associated.");
    }

    const paymentRequest = {
      encKey: ENC_KEY,
      saltKey: SECURE_SECRET,
      returnURL: `${RETURNURL}/${orderId}`,
      bankId: BANKID,
      passCode: PASSCODE,
      mcc: MCC,
      txnRefNo: `TXN_${orderId}_${Date.now()}`,
      merchantId: "100000000003925",
      terminalId: "12545910",
      currency: "INR",
      amount: order.totalPrice.toString(),
      orderInfo: `Order for ${orderId}`,
      email: user.email,
      city: address.city,
      firstName: user.firstName,
      lastName: user.lastName,
      state: address.state,
      street: address.street,
      zip: address.zipCode,
      phone: address.phone,
    };

    const response = await icici.initiate(paymentRequest);

    if (response.status) {
      return {
        paymentLinkId: response.data.txnRefNo,
        payment_link_url: response.data.gatewayURL,
      };
    } else {
      throw new Error("Failed to create payment link");
    }
  } catch (error) {
    console.error("Error creating payment link:", error.message);
    throw new Error(error.message);
  }
};

const updatePaymentInformation = async (reqData) => {
  const { payment_id: paymentId, order_id: orderId } = reqData;
  if (!paymentId || !orderId)
    throw new Error("Payment ID and Order ID are required");

  try {
    const order = await orderService.findOrderById(orderId);
    if (!order) throw new Error(`Order with ID ${orderId} not found`);

    // Fetch payment status using ICICI API
    const paymentStatus = await icici.getPaymentStatus({
      txnRefNo: paymentId,
      encKey: ENC_KEY,
      saltKey: SECURE_SECRET,
    });

    console.log("Payment Status:", paymentStatus);

    // Check payment status
    if (
      paymentStatus &&
      paymentStatus.data &&
      paymentStatus.data.paymentStatus === "Success"
    ) {
      // Update order payment details and status
      order.paymentDetails = {
        paymentId,
        status: "COMPLETED",
      };
      order.orderStatus = "PLACED";
      await order.save();

      console.log(`Payment successful for order ${orderId}`);
      return { success: true, message: "Payment status updated successfully" };
    } else {
      throw new Error("Payment failed or status not successful");
    }
  } catch (error) {
    console.error("Error updating payment information:", error);
    throw new Error(error.message);
  }
};

module.exports = { createPaymentLink, updatePaymentInformation };
