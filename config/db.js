// config/db.js
const { MongoClient } = require("mongodb");

const uri =
  process.env.MONGO_URI ||
  "mongodb+srv://seenu:iYkshpW222dzjCdx@stocks.pjsrssn.mongodb.net/";
const dbName = process.env.DB_NAME || "stocks";

let dbInstance = null;

const dbConnect = async () => {
  if (dbInstance) return dbInstance;

  try {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    console.log("MongoDB connected");
    dbInstance = client.db(dbName);
    return dbInstance;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
};

module.exports = dbConnect;
