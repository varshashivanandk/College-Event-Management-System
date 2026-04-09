const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  usn: String,
  email: String,
  department: String,
  year: String,
  eventId: String
});

module.exports = mongoose.model("Registration", RegistrationSchema);