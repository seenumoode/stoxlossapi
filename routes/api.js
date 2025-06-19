// routes/api.js
const express = require("express");
const router = express.Router();
const moment = require("moment-timezone");
const { initializeWebSocket, getDb } = require("../config");
const { isTodayWorkingDay, isStockTimings } = require("../utils/utils");
const axios = require("axios");

module.exports = (db, cache) => {
  // POST endpoint to receive access token and start/reuse WebSocket
  router.post("/auth", async (req, res) => {
    const { accessToken } = req.body;
    // Get current time in IST
    const now = moment.tz("Asia/Kolkata");

    // Set expiry to 3:30 AM IST next day
    const expiry = moment
      .tz("Asia/Kolkata")
      .add(1, "day")
      .set({ hour: 3, minute: 30, second: 0, millisecond: 0 });

    // Calculate expiry in seconds
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

  router.get("/getAuth", async (req, res) => {
    try {
      let cachedAuth = "";
      cachedAuth = await cache.get("auth");
      console.log("Cached Auth:", cachedAuth);
      if (cachedAuth.length > 0) {
        return res.json({
          source: "cache",
          auth: "Authenticated",
        });
      } else {
        return res.json({
          source: "cache",
          auth: "Not Authenticated",
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

  // Upstocks code

  router.get("/upstox/historicalTrades", async (req, res) => {
    try {
      const { endDate } = req.query; // Get endDate from query params
      let cachedAuth = await cache.get("auth");
      console.log("Cached Auth (raw):", cachedAuth);

      if (!endDate) {
        return res.status(400).json({ error: "endDate is required" });
      }

      // Remove surrounding quotes from cachedAuth if they exist
      if (cachedAuth && typeof cachedAuth === "string") {
        cachedAuth = cachedAuth.replace(/^"|"$/g, ""); // Remove leading/trailing quotes
      }

      if (!cachedAuth) {
        return res.status(401).json({ error: "No authentication token found" });
      }

      const url = "https://api.upstox.com/v2/charges/historical-trades";
      const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${cachedAuth}`,
      };

      const params = {
        segment: "FO",
        start_date: "2025-06-01",
        end_date: endDate,
        page_number: "1",
        page_size: "100",
      };

      const response = await axios.get(url, {
        headers: headers,
        params: params,
      });

      // Send response.data.data if exists, else empty array
      res.json(response.data.data || []);
    } catch (error) {
      console.error("Error fetching Orders:", error.message);
      // Extract only serializable parts of the error response
      const errorResponse = error.response
        ? {
            status: error.response.status,
            data: error.response.data || null,
            message: error.message || "Unknown error",
          }
        : {
            status: 500,
            data: null,
            message: error.message || "Internal server error",
          };
      res.status(errorResponse.status).json(errorResponse.data || []);
    }
  });

  router.get("/upstox/positions", async (req, res) => {
    try {
      let cachedAuth = await cache.get("auth");
      console.log("Cached Auth (raw):", cachedAuth);

      // Remove surrounding quotes from cachedAuth if they exist
      if (cachedAuth && typeof cachedAuth === "string") {
        cachedAuth = cachedAuth.replace(/^"|"$/g, ""); // Remove leading/trailing quotes
      }

      if (!cachedAuth) {
        return res.status(401).json({ error: "No authentication token found" });
      }

      const url = "https://api.upstox.com/v2/portfolio/short-term-positions";
      const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${cachedAuth}`,
      };

      const response = await axios.get(url, {
        headers: headers,
      });

      // Send response.data.data if exists, else empty array
      res.json(response.data.data || []);
    } catch (error) {
      console.error("Error fetching positions:", error.message);
      // Extract only serializable parts of the error response
      const errorResponse = error.response
        ? {
            status: error.response.status,
            data: error.response.data || null,
            message: error.message || "Unknown error",
          }
        : {
            status: 500,
            data: null,
            message: error.message || "Internal server error",
          };
      res.status(errorResponse.status).json(errorResponse.data || []);
    }
  });

  router.get("/upstox/profitLoss", async (req, res) => {
    try {
      const { toDate } = req.query; // Get toDate from query params
      let cachedAuth = await cache.get("auth");
      console.log("Cached Auth (raw):", cachedAuth);

      if (!toDate) {
        return res.status(400).json({ error: "toDate is required" });
      }

      // Remove surrounding quotes from cachedAuth if they exist
      if (cachedAuth && typeof cachedAuth === "string") {
        cachedAuth = cachedAuth.replace(/^"|"$/g, ""); // Remove leading/trailing quotes
      }

      if (!cachedAuth) {
        return res.status(401).json({ error: "No authentication token found" });
      }

      const url = "https://api.upstox.com/v2/trade/profit-loss/data";
      const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${cachedAuth}`,
      };

      const params = {
        from_date: "01-06-2025",
        to_date: toDate,
        segment: "FO",
        financial_year: "2526",
        page_number: "1",
        page_size: "15",
      };

      const response = await axios.get(url, {
        headers: headers,
        params: params,
      });

      // Send response.data.data if exists, else empty array
      res.json(response.data.data || []);
    } catch (error) {
      console.error("Error fetching profit/loss data:", error.message);
      // Extract only serializable parts of the error response
      const errorResponse = error.response
        ? {
            status: error.response.status,
            data: error.response.data || null,
            message: error.message || "Unknown error",
          }
        : {
            status: 500,
            data: null,
            message: error.message || "Internal server error",
          };
      res.status(errorResponse.status).json(errorResponse.data || []);
    }
  });

  return router;
};
