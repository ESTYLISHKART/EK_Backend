const ICICI = require("icici-dev");
const {
  ENC_KEY,
  SECURE_SECRET,
  BANKID,
  PASSCODE,
  MCC,
  RETURNURL,
} = require("./constants");

const icici = new ICICI();

module.exports = {
  icici,
  ENC_KEY,
  SECURE_SECRET,
  BANKID,
  PASSCODE,
  MCC,
  RETURNURL,
};
