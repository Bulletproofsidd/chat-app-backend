const Message = require("../models/message.model")
const Conversation = require("../models/conversation.model")

const onlineUsers = {}

module.exports = function setupSocket(server) {
  const io = require("socket.io")(server, {
  cors: {
    origin:["http://localhost:5173","https://chat-app-frontend-two-xi.vercel.app"] ,
    methods: ["GET", "POST"]
  }
})  
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId
    onlineUsers[userId] = socket.id

    console.log("a user connected", socket.id)

    socket.on("sendMessage", async (data) => {
      const { receiverId, text, conversationId } = data

      const message = await Message.create({
        sender: userId,
        conversationId,
        text
      })

      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: message._id
      })

      const receiverSocketId = onlineUsers[receiverId]
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", message)
      }
    })

    socket.on("disconnect", () => {
      delete onlineUsers[userId]
      console.log("a user disconnected", socket.id)
    })

    socket.on("typing",(receiverId)=>{
      const receiverSocketId=onlineUsers[receiverId]
      if(receiverSocketId){
        io.to(receiverSocketId).emit("typing",userId)
      }
    })
  })

  return io
}
module.exports.onlineUsers=onlineUsers;