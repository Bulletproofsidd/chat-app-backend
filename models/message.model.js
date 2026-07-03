const mongoose = require("mongoose")

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation"
  },
  text: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model("Message", MessageSchema)