// routes/api.js
const express = require("express");
const router = express.Router();
const { initializeWebSocket, getDb } = require("../config");
const { isTodayWorkingDay, getPreviousWorkingDay } = require("../utils/utils");

module.exports = (db, cache) => {
  // POST endpoint to receive access token and start/reuse WebSocket
  router.post("/auth", async (req, res) => {
    if (isTodayWorkingDay()) {
      try {
        console.log("Received access token:", req.body);
        const { accessToken } = req.body;
        if (!accessToken) {
          return res.status(400).json({ error: "Access token is required" });
        }
        await initializeWebSocket(accessToken);
        res.json({ message: "WebSocket initialized successfully" });
      } catch (err) {
        console.error("Error initializing WebSocket:", err);
        res.status(500).json({ error: "Failed to initialize WebSocket" });
      }
    } else {
      res.json({ message: "Today is holiday no need of websocket" });
    }
  });

  // Example endpoint to get gainers/losers
  router.get("/data", async (req, res) => {
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

  router.post("/getPastData", async (req, res) => {
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
          // Do something with combinedData
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
