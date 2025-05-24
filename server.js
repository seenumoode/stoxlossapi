// server.js
const express = require("express");
const axios = require("axios");
const { getDb, getCache, initializeUIWebSocket } = require("./config");
const apiRoutes = require("./routes/api");
const cors = require("cors");
const http = require("http");

const API_KEY = "a1cfd100-f1f7-40df-a575-ac5fbcb84975";
const API_SECRET = "wbuj4bffst";
const REDIRECT_URI = "http://localhost:3000/callback";

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

const startServer = async () => {
  try {
    const db = await getDb();
    const cache = await getCache();
    await initializeUIWebSocket(server, getCache);
    // Step 1: Redirect user to Upstox login
    app.get("/login", (req, res) => {
      const authUrl = `https://api.upstox.com/v2/login/authorization/dialog?client_id=${API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
      res.redirect(authUrl);
    });

    // Step 2: Handle redirect and extract auth code
    app.get("/callback", async (req, res) => {
      const authCode = req.query.code; // Extract auth code from query parameter
      if (!authCode) {
        return res.status(400).send("No authorization code received");
      }

      // Step 3: Exchange auth code for access token
      try {
        const response = await axios.post(
          "https://api.upstox.com/v2/login/authorization/token",
          {
            code: authCode,
            client_id: API_KEY,
            client_secret: API_SECRET,
            redirect_uri: REDIRECT_URI,
            grant_type: "authorization_code",
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              accept: "application/json",
            },
          }
        );

        const accessToken = response.data.access_token;
        res.send(`Access Token: ${accessToken}`);
      } catch (error) {
        res
          .status(500)
          .send(`Error: ${error.response?.data?.error || error.message}`);
      }
    });
    app.use("/api", apiRoutes(db, cache));
    require("./cron/jobs");
    server.listen(PORT, () => {
      console.log(`HTTP server running on port ${PORT}`);
    });

    // Confirm HTTP server is listening
    server.on("listening", () => {
      console.log(`HTTP server listening on port ${PORT}`);
    });

    // Debug WebSocket upgrade requests
    server.on("upgrade", (request, socket, head) => {
      console.log(`Received WebSocket upgrade request for ${request.url}`);
      //console.log(`Headers: ${JSON.stringify(request.headers, null, 2)}`);
    });

    server.on("error", (err) => {
      console.error("HTTP server error:", err);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
