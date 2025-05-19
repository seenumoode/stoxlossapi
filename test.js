const { MongoClient } = require("mongodb");
const gainers = require("./data/gainers.js");
const losers = require("./data/losers.js");

const db = require("./mongo");

async function run() {
  try {
    const now = new Date();
    now.setDate(now.getDate() - 1);
    now.setHours(0, 0, 0, 0);

    db.then((dbInstance) => {
      const collection = dbInstance.collection("stoxdata");
      const updated = new Date();
      collection.createIndex({ date: 1, type: 1 }, { unique: true });
      const query = { date: now, type: "loser" };
      const update = {
        $set: { date: now, type: "loser", data: losers, updated: now },
      };
      const options = { upsert: true };
      collection.updateOne(query, update, options);
    });
  } finally {
    // Close the database connection when finished or an error occurs
  }
}

// config/redis.js
const redis = require("redis");

const redisClient = redis.createClient({
  url:
    process.env.REDIS_URL ||
    "redis://redis-16347.c305.ap-south-1-1.ec2.redns.redis-cloud.com:16347",
});

redisClient.on("error", (err) => console.error("Redis connection error:", err));
redisClient.on("connect", () => console.log("Redis connected"));

const connectRedis = async () => {
  if (redisClient.isOpen) return redisClient;
  await redisClient.connect();
  return redisClient;
};

module.exports = connectRedis;

run().catch(console.error);
