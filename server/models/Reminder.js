const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  medicine: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    required: true
  },
  sent: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Reminder", reminderSchema);
