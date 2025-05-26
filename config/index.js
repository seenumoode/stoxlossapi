// config/index.js
const dbConnect = require("./db");
const connectRedis = require("./redis");
const {
  initializeWebSocket,
  getWebSocket,
  stopWebSocket,
} = require("./websocket");
const { initializeUIWebSocket, getUIWebSocket } = require("./ui-websocket");

module.exports = {
  getDb: dbConnect,
  getCache: connectRedis,
  initializeWebSocket,
  getWebSocket,
  initializeUIWebSocket,
  getUIWebSocket,
  stopWebSocket,
};
