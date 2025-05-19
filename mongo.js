// db.js
const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://seenu:iYkshpW222dzjCdx@stocks.pjsrssn.mongodb.net/"; // Replace with your MongoDB URI
const dbName = "stocks";

let dbInstance = null;

const dbConnect = new Promise((resolve, reject) => {
    if (dbInstance) return resolve(dbInstance);

    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    client
        .connect()
        .then(() => {
            console.log("MongoDB connected");
            dbInstance = client.db(dbName);
            resolve(dbInstance);
        })
        .catch(err => {
            console.error("MongoDB connection error:", err);
            reject(err);
        });
});

module.exports = dbConnect;
