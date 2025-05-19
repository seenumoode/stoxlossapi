// config/redis.js
const redis = require("redis");

const redisClient = redis.createClient({
  username: "default",
  password: "wIKyV9yBjYUJP7DsZYO7Z7PRlZjHreTR",
  socket: {
    host: "redis-16347.c305.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 16347,
  },
});

redisClient.on("error", (err) => console.error("Redis connection error:", err));
redisClient.on("connect", () => console.log("Redis connected"));

const connectRedis = async () => {
  if (redisClient.isOpen) return redisClient;
  await redisClient.connect();
  return redisClient;
};

module.exports = connectRedis;
