const redis = require("redis");

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => {
  console.log("Redis error:", err);
});

redisClient.on("connect", () => {
  console.log("Redis Connected");
});

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error("Redis connection failed:", err);
  }
})();

module.exports = redisClient;