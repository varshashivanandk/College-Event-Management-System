const mongoose = require("mongoose");

const LoginSchema = new mongoose.Schema({
  email: String,
  role: String,
  loginTime: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Login", LoginSchema);