const redis=require("redis")

    const redisClient =redis.createClient ()
        redisClient.connect()

    redisClient.on("error",(err)=>console.log("Redis error",err))
    redisClient.on("connect",(err)=>console.log("Redis Connected"))

    module.exports=redisClient;