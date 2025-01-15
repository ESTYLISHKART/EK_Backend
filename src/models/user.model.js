const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    role: {
      type: String,
      enum: ["CUSTOMER", "ADMIN", "SELLER"],
      default: "CUSTOMER",
    },
    mobile: {
      type: String,
      match: [/^\d{10}$/, "Please provide a valid 10-digit phone number"],
    },
    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema); // Use "User" as the model name
module.exports = User;
