const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: String,
    location: String
});

module.exports = mongoose.model("Event", EventSchema);