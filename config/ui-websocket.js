// config/ui-websocket.js
const WebSocket = require("ws");

let wss = null;

const initializeUIWebSocket = async (server, getCache) => {
  if (wss) {
    console.log("Reusing existing UI WebSocket server");
    return wss;
  }
  // Initialize WebSocket server
  wss = new WebSocket.Server({ server });

  wss.on("connection", async (ws) => {
    console.log("UI WebSocket client connected");

    ws.on("close", () => {
      console.log("UI WebSocket client disconnected");
    });

    ws.on("error", (err) => {
      console.error("UI WebSocket error:", err);
    });
    wss.on("listening", () => {
      console.log("UI WebSocket server listening on ws://localhost:3000");
    });
  });

  wss.on("error", (err) => {
    console.error("WebSocket server error:", err);
  });

  // Tie WebSocket readiness to HTTP server listening
  server.on("listening", () => {
    const address = server.address();
    console.log(
      `UI WebSocket server listening on ws://localhost:${address.port}`
    );
  });
  console.log("UI WebSocket server initialized");
  return wss;
};

const getUIWebSocket = () => {
  if (!wss) {
    throw new Error("UI WebSocket server not initialized");
  }
  return wss;
};

module.exports = { initializeUIWebSocket, getUIWebSocket };
