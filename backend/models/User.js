const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  name: String,
  email: String,
  password: String,
  role: String,
  usn: String,
  department: String
});

module.exports = mongoose.model("User", UserSchema);