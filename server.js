require("dotenv").config();
const express = require("express");
const axios = require("axios");
const { getDb, getCache, initializeUIWebSocket } = require("./config");
const apiRoutes = require("./routes/api");
const cors = require("cors");
const http = require("http");
const helmet = require("helmet"); // Add helmet for secure headers
const rateLimit = require("express-rate-limit"); // Add rate limiting

const API_KEY = "a1cfd100-f1f7-40df-a575-ac5fbcb84975";
const API_SECRET = "wbuj4bffst";
const REDIRECT_URI = "http://localhost:3000/callback";
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "JWT_SECRET=9f7a2b8c3d4e5f67890123456789abcdef1234567890fedcba";

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

app.use(express.json());
app.use(cors());
app.use(helmet()); // Secure HTTP headers

// Rate limiting for login endpoint
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per IP
  message: "Too many login attempts, please try again after 15 minutes.",
});

// Initialize cache globally for use in login endpoint
let cache;

const startServer = async () => {
  try {
    const db = await getDb();
    cache = await getCache();
    await initializeUIWebSocket(server, getCache);

    // Existing Upstox OAuth login
    app.get("/login", (req, res) => {
      const authUrl = `https://api.upstox.com/v2/login/authorization/dialog?client_id=${API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
      res.redirect(authUrl);
    });

    // Existing Upstox callback
    app.get("/callback", async (req, res) => {
      const authCode = req.query.code;
      if (!authCode) {
        return res.status(400).send("No authorization code received");
      }
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

    // New user login endpoint
    const bcrypt = require("bcrypt");
    const jwt = require("jsonwebtoken");
    const validator = require("validator");

    app.post("/api/user/login", loginLimiter, async (req, res) => {
      try {
        const { username, password } = req.body;

        // Input validation
        if (!username || !password) {
          return res
            .status(400)
            .json({ error: "Username and password are required" });
        }
        if (
          !validator.isAlphanumeric(username) ||
          !validator.isLength(username, { min: 3, max: 50 })
        ) {
          return res.status(400).json({ error: "Invalid username format" });
        }
        if (!validator.isLength(password, { min: 8 })) {
          return res
            .status(400)
            .json({ error: "Password must be at least 8 characters" });
        }

        // Fetch user from Redis
        const key = `user:${username}`;
        const storedPassword = await cache.get(key);
        if (!storedPassword) {
          return res
            .status(401)
            .json({ error: "Invalid username or password" });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, storedPassword);
        if (!isPasswordValid) {
          return res
            .status(401)
            .json({ error: "Invalid username or password" });
        }

        // Generate JWT
        const token = jwt.sign(
          { username, role: "user" },
          process.env.JWT_SECRET,
          { expiresIn: "6h" }
        );

        // Set HTTP-only cookie
        res.cookie("jwtToken", token, {
          httpOnly: true, // Prevent client-side JavaScript access
          secure: process.env.NODE_ENV === "production", // Use secure in production (requires HTTPS)
          sameSite: "Strict", // Prevent CSRF
          maxAge: 6 * 60 * 60 * 1000, // 6 hours in milliseconds
        });

        res.json({ message: "Login successful" });
      } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.use("/api", apiRoutes(db, cache));

    require("./cron/jobs");
    server.listen(PORT, () => {
      console.log(`HTTP server running on port ${PORT}`);
    });

    server.on("listening", () => {
      console.log(`HTTP server listening on port ${PORT}`);
    });

    server.on("upgrade", (request, socket, head) => {
      console.log(`Received WebSocket upgrade request for ${request.url}`);
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
