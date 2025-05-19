// routes/api.js
const express = require("express");
const router = express.Router();
const { initializeWebSocket } = require("../config");

module.exports = (db, cache) => {
  // POST endpoint to receive access token and start/reuse WebSocket
  router.post("/auth", async (req, res) => {
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
  });

  // Example endpoint to get gainers/losers
  router.get("/data", async (req, res) => {
    try {
      const cachedGainers = await cache.get("gainers");
      const cachedLosers = await cache.get("losers");
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

  return router;
};
