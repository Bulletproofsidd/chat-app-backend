require("dotenv").config();
const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const connectDB = require("./config/db")
const http = require("http")
const setupSocket=require("./socket/socket")
const redisClient=require("./config/redis")

connectDB()

const app = express()  // ← create app FIRST
const server = http.createServer(app) // ← then wrap it
const io=setupSocket(server)


// Middleware
app.use(express.json())
app.use(cors({
  origin: ["http://localhost:5173", "https://chat-app-frontend-two-xi.vercel.app"],
  credentials: true
}))

// routes
const authRoutes = require("./routes/routes")
app.use("/api/auth", authRoutes)
const messageRoutes = require("./routes/message.routes")
app.use("/api/messages", messageRoutes)
const userRoutes=require("./routes/user.routes")
app.use("/api/users",userRoutes)

// test route
app.use("/", (req, res) => {
  res.json({ message: "Server Running at port" })
})


//health route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});


const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`Server running at Port ${PORT}`)
})