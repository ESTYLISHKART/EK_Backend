const CONSTANTS = {
  ENC_KEY: "1FF49170C8CCECFF1345B38F971CABBD",
  SECURE_SECRET: "5FF1003BD85EC13EDDE106AC235F58AD",
  VERSION: "1",
  PASSCODE: "ABCD1234",
  MERCHANTID: "100000000005859",
  TERMINALID: "EG000488",
  BANKID: "24520",
  MCC: "8641",
  GATEWAYURL:
    "https://payuatrbac.icicibank.com/accesspoint/angularBackEnd/requestproxypass",
  REFUNDURL:
    "https://payuatrbac.icicibank.com/accesspoint/v1/24520/createRefundFromMerchantKit",
  STATUSURL:
    "https://payuatrbac.icicibank.com/accesspoint/v1/24520/checkStatusMerchantKit",
  RETURNURL: "http://localhost:3000/check_response",
};

module.exports = CONSTANTS;
