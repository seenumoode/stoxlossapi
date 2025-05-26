// config/websocket.js
const UpstoxClient = require("upstox-js-sdk");

const { instrumentKeys, processMap } = require("../data/marketData");

let streamerInstance = null;
let accessToken = null;

const initializeWebSocket = async (token) => {
  if (streamerInstance) {
    console.log("Reusing existing Upstox WebSocket connection");
    return streamerInstance;
  }

  if (!token) {
    throw new Error("Access token required for WebSocket connection");
  }

  accessToken = token;

  // Initialize Upstox client
  let defaultClient = UpstoxClient.ApiClient.instance;
  let OAUTH2 = defaultClient.authentications["OAUTH2"];
  OAUTH2.accessToken = accessToken;

  // Create WebSocket connection
  streamerInstance = new UpstoxClient.MarketDataStreamerV3(
    instrumentKeys,
    "full"
  );

  streamerInstance.on("open", () => {
    console.log(
      `Upstox WebSocket connected. Instruments: ${instrumentKeys.length}`
    );
    streamerInstance.subscribe(instrumentKeys, "full");
  });

  streamerInstance.on("message", (data) => {
    try {
      const feeds = JSON.parse(data)?.feeds;
      if (feeds) {
        for (const instrumentKey in feeds) {
          const ohlc =
            feeds[instrumentKey].fullFeed?.marketFF?.marketOHLC?.ohlc[0];
          const close = feeds[instrumentKey].fullFeed?.marketFF?.ltpc?.cp;
          const percentageChange = close
            ? ((ohlc.close - close) / close) * 100
            : 0;
          const high = ohlc?.high;
          const low = ohlc?.low;
          const todayClose = ohlc?.close;

          // Update percentageChangeMap in shared data
          const { percentageChangeMap } = require("../data/marketData");
          percentageChangeMap.set(instrumentKey, {
            percentageChange,
            high,
            low,
            close: todayClose,
          });
        }
      }
    } catch (error) {
      console.error("Message Processing Error:", error);
    }
  });

  streamerInstance.on("error", (error) => {
    console.error("WebSocket Error:", error);
  });

  streamerInstance.on("close", () => {
    console.log("WebSocket connection closed");
    streamerInstance = null;
  });

  streamerInstance.autoReconnect(true, 10, 3);
  streamerInstance.connect();

  return streamerInstance;
};

const getWebSocket = async () => {
  if (!streamerInstance) {
    throw new Error(
      "WebSocket not initialized. Please provide access token via POST request."
    );
  }
  return streamerInstance;
};

const stopWebSocket = () => {
  if (streamerInstance) {
    streamerInstance = null;
    console.log("WebSocket connection closed");
  } else {
    console.log("No active WebSocket connection to close");
  }
};

module.exports = { initializeWebSocket, getWebSocket, stopWebSocket };
