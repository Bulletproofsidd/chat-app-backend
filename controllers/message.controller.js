const Message = require("../models/message.model")
const Conversation = require("../models/conversation.model")

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    const message = await Message.create({
      sender: req.user._id,  // comes from JWT middleware later
      conversationId,
      text
    })
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id
    })
    res.status(201).json(message)
  }
  catch (error) {
    res.status(500).json({ message: error.message })
  }

}

exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params
    const messages = await Message.find({ conversationId })
    res.status(200).json(messages)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getOrCreateConversation = async (req, res) => {
  try {
    const { receiverId } = req.body

    const conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, receiverId] }
    })  

    if (conversation) {
      return res.status(200).json(conversation)
    }

    const newConversation = await Conversation.create({
      participants: [req.user.id, receiverId]
    })

    res.status(201).json(newConversation)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}