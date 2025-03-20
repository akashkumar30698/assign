const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ["sent", "received"], default: "sent" },
});

module.exports = mongoose.model("Message", MessageSchema);
