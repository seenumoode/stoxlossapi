const express = require("express");
const router = express.Router();
const moment = require("moment-timezone");
const { initializeWebSocket, getDb } = require("../config");
const { isTodayWorkingDay, isStockTimings } = require("../utils/utils");
const jwt = require("jsonwebtoken");
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "JWT_SECRET=9f7a2b8c3d4e5f67890123456789abcdef1234567890fedcba";

module.exports = (db, cache) => {
  // JWT Authentication Middleware
  const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access token required" });
    }
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired" });
      }
      return res.status(403).json({ error: "Invalid token" });
    }
  };

  // POST /auth - Protected
  router.post("/auth", authenticateJWT, async (req, res) => {
    const { accessToken } = req.body;
    const now = moment.tz("Asia/Kolkata");
    const expiry = moment
      .tz("Asia/Kolkata")
      .add(1, "day")
      .set({ hour: 3, minute: 30, second: 0, millisecond: 0 });
    const expiryInSeconds = Math.floor((expiry - now) / 1000);

    if (isTodayWorkingDay() && isStockTimings()) {
      try {
        console.log("Received access token:", req.body);
        if (!accessToken) {
          return res.status(400).json({ error: "Access token is required" });
        }
        await initializeWebSocket(accessToken);
        cache.set("auth", JSON.stringify(accessToken), { EX: expiryInSeconds });
        res.json({ message: "WebSocket initialized successfully" });
      } catch (err) {
        console.error("Error initializing WebSocket:", err);
        res.status(500).json({ error: "Failed to initialize WebSocket" });
      }
    } else {
      cache.set("auth", JSON.stringify(accessToken), { EX: expiryInSeconds });
      res.json({ message: "Today is holiday no need of websocket" });
    }
  });

  // GET /data - Protected
  router.get("/data", authenticateJWT, async (req, res) => {
    try {
      let cachedGainers = [];
      let cachedLosers = [];
      if (isTodayWorkingDay()) {
        cachedGainers = await cache.get("gainers");
        cachedLosers = await cache.get("losers");
      } else {
        cachedGainers = await cache.get("gainerYes");
        cachedLosers = await cache.get("loserYes");
      }
      if (cachedGainers && cachedLosers) {
        return res.json({
          source: "cache",
          gainers: JSON.parse(cachedGainers),
          losers: JSON.parse(cachedLosers),
        });
      }
    } catch (err) {
      console.error("API error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // GET /getAuth - Now Protected
  router.get("/getAuth", authenticateJWT, async (req, res) => {
    try {
      let cachedAuth = await cache.get("auth");
      console.log("Cached Auth:", cachedAuth);
      if (cachedAuth) {
        return res.json({
          source: "cache",
          auth: JSON.parse(cachedAuth),
        });
      }
      return res.status(404).json({ error: "No auth token found in cache" });
    } catch (err) {
      console.error("API error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // POST /getPastData - Protected
  router.post("/getPastData", authenticateJWT, async (req, res) => {
    try {
      console.log("Received access token:", req.body);
      const { date } = req.body;
      const db = await getDb();

      const istDate = new Date(date);

      const collection = db.collection("stoxdata");
      const loserQuery = { date: istDate, type: "loser" };
      const gainerQuery = { date: istDate, type: "gainer" };

      Promise.all([
        collection.find(loserQuery).toArray(),
        collection.find(gainerQuery).toArray(),
      ])
        .then(([losers, gainers]) => {
          const combinedData = { losers, gainers };
          res.json({
            source: "db",
            losers: losers.length ? losers[0].data : [],
            gainers: gainers.length ? gainers[0].data : [],
          });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          throw error;
        });
    } catch (err) {
      console.error("API error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
};
