const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  category: String,
  venue: String,
  location: String, // Added location field

  timeStart: String,
  timeEnd: String,

  maxParticipants: Number,   // ✅ ADD THIS
  status: {
  type: String,
  default: "pending"
},         // ✅ ADD THIS

  coordinator: {
    name: String,
    usn: String,
    email: String,
    department: String
  }
});

module.exports = mongoose.model("Event", EventSchema);