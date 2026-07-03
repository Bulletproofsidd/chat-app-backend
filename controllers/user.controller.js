const User = require("../models/user.model")
const redisClient = require("../config/redis")

exports.getUsers = async (req, res) => {
  try {
    // 1. check Redis cache first
    const cachedUsers = await redisClient.get("all_users")

    if (cachedUsers) {
      console.log("serving from cache")
      return res.status(200).json(JSON.parse(cachedUsers))
    }

    // 2. not cached — fetch from MongoDB
    const users = await User.find({ _id: { $ne: req.user.id } })

    // 3. save to Redis for next time (expires in 60 seconds)
    await redisClient.set("all_users", JSON.stringify(users), { EX: 60 })

    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}