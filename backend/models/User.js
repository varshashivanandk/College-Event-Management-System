const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  name: String,
  email: String,
  password: String,
  role: String,
  usn: String,
  department: String,
  status: {
    type: String,
    default: "pending"
  }
});

module.exports = mongoose.model("User", UserSchema);