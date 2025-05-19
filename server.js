// server.js
const express = require("express");
const { getDb, getCache } = require("./config");
const apiRoutes = require("./routes/api");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const startServer = async () => {
  try {
    const db = await getDb();
    const cache = await getCache();
    app.use("/api", apiRoutes(db, cache));
    require("./cron/jobs");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
