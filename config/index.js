// config/index.js
const dbConnect = require("./db");
const connectRedis = require("./redis");
const { initializeWebSocket, getWebSocket } = require("./websocket");

module.exports = {
  getDb: dbConnect,
  getCache: connectRedis,
  initializeWebSocket,
  getWebSocket,
};
