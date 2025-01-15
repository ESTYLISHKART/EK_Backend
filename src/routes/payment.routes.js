const express = require("express");
const authenticate = require("../middleware/authenticat.js");
const router = express.Router();
const paymentController = require("../controllers/payment.controller.js");

router.post(
  "/:orderId",
  authenticate,
  paymentController.createPaymentLinkController
);
router.post(
  "/updatePaymentInformation",
  authenticate,
  paymentController.updatePaymentInformation
);

module.exports = router;
