const paymentService = require("../services/payment.service.js");
const { createPaymentLink } = require("../services/payment.service");

const createPaymentLinkController = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      throw new Error("Order ID is required");
    }
    console.log("Creating payment link for orderId:", orderId);
    const paymentLinkResponse = await createPaymentLink(orderId);

    return res.json({
      success: true,
      paymentLinkId: paymentLinkResponse.paymentLinkId,
      paymentLinkURL: paymentLinkResponse.payment_link_url,
    });
  } catch (error) {
    console.error("Error creating payment link:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updatePaymentInformation = async (req, res) => {
  const { payment_id: paymentId, order_id: orderId } = req.body;
  console.log("Received paymentId:", paymentId, "orderId:", orderId);

  if (!paymentId || !orderId)
    return res
      .status(400)
      .send({ message: "Payment ID and Order ID are required" });

  try {
    const result = await paymentService.updatePaymentInformation(req.query);
    console.log("Payment info updated successfully:", result);

    return res
      .status(200)
      .send({ message: "Payment information updated", status: true });
  } catch (error) {
    console.error("Error updating payment information:", error);
    return res.status(500).send({ message: error.message });
  }
};

module.exports = { createPaymentLinkController, updatePaymentInformation };

// const paymentService=require("../services/payment.service.js")

// const createPaymentLink=async(req,res)=>{

//     try {
//         const paymentLink=await paymentService.createPaymentLink(req.params.id);
//         return res.status(200).send(paymentLink)
//     } catch (error) {
//         return res.status(500).send(error.message);
//     }

// }

// const updatePaymentInformation=async(req,res)=>{

//     try {
//         await paymentService.updatePaymentInformation(req.query)
//         return res.status(200).send({message:"payment information updated",status:true})
//     } catch (error) {
//         return res.status(500).send(error.message);
//     }

// }

// module.exports={createPaymentLink,updatePaymentInformation}
