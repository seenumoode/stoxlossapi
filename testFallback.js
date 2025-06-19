const UpstoxClient = require("upstox-js-sdk");

const instrumentKeys = ["NSE_FO|80198", "NSE_FO|118678", "NSE_FO|118823"];
const lastTradeValues = [
  { instrumentKey: "NSE_FO|80198", lastTradePrice: 1.25, buyPrice: 2.95 },
  { instrumentKey: "NSE_FO|118678", lastTradePrice: 32.15, buyPrice: 30.5 },
  { instrumentKey: "NSE_FO|118823", lastTradePrice: 4.1, buyPrice: 3.0 },
];

// Track state for each instrument
const instrumentStates = new Map();
instrumentKeys.forEach((key) =>
  instrumentStates.set(key, {
    currentThreshold: 10,
    previousThreshold: 0,
    fallbackStartTime: null,
    status: "open", // "open" or "closed"
  })
);

const BUFFER_PERCENTAGE = 2; // 2% buffer below previousThreshold
const FALLBACK_PERIOD = 300000; // 5 minutes in milliseconds

let streamerInstance = null;
let accessToken = null;

const token =
  "eyJ0eXAiOiJKV1QiLCJrZXlfaWQiOiJza192MS4wIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiIzMkNYMzYiLCJqdGkiOiI2ODUwZTYzOTg0MDJjYjJhYmY1NzE0MTkiLCJpc011bHRpQ2xpZW50IjpmYWxzZSwiaXNQbHVzUGxhbiI6ZmFsc2UsImlhdCI6MTc1MDEzMjI4MSwiaXNzIjoidWRhcGktZ2F0ZXdheS1zZXJ2aWNlIiwiZXhwIjoxNzUwMTk3NjAwfQ.eKBOMKjQ7DJ1kunthrdYxD68bCV44vJzS_TnA458EAE";

// Calculate percentage change
const calculatePercentageChange = (currentPrice, previousPrice) => {
  if (previousPrice === 0) return 0;
  return ((currentPrice - previousPrice) / previousPrice) * 100;
};

// Fetch position quantity
const getPositionQuantity = async (instrumentKey) => {
  try {
    let defaultClient = UpstoxClient.ApiClient.instance;
    let OAUTH2 = defaultClient.authentications["OAUTH2"];
    OAUTH2.accessToken = accessToken;

    const positionApi = new UpstoxClient.PositionApi();
    const response = await positionApi.getPositions();
    const position = response.data.find(
      (pos) => pos.instrument_token === instrumentKey
    );
    return position ? Math.abs(position.quantity) : 0;
  } catch (error) {
    console.error(`Error fetching position for ${instrumentKey}:`, error);
    return 0;
  }
};

// Close position
const closePosition = async (instrumentKey) => {
  try {
    const quantity = await getPositionQuantity(instrumentKey);
    if (quantity === 0) {
      console.log(`No open position for ${instrumentKey}`);
      instrumentStates.set(instrumentKey, {
        currentThreshold: 10,
        previousThreshold: 0,
        fallbackStartTime: null,
        status: "closed",
      });
      return;
    }

    let defaultClient = UpstoxClient.ApiClient.instance;
    let OAUTH2 = defaultClient.authentications["OAUTH2"];
    OAUTH2.accessToken = accessToken;

    const orderApi = new UpstoxClient.OrderApi();
    const orderDetails = {
      quantity,
      product: "I", // Adjust to "D" for delivery if needed
      validity: "DAY",
      price: 0, // Market order
      instrument_token: instrumentKey,
      order_type: "MARKET",
      transaction_type: "SELL",
      disclosed_quantity: 0,
      trigger_price: 0,
      is_amo: false,
    };

    const response = await orderApi.placeOrder(orderDetails);
    console.log(
      `Position closed for ${instrumentKey} (Quantity: ${quantity}):`,
      response
    );

    // Reset state and mark as closed
    instrumentStates.set(instrumentKey, {
      currentThreshold: 10,
      previousThreshold: 0,
      fallbackStartTime: null,
      status: "closed",
    });
  } catch (error) {
    console.error(`Error closing position for ${instrumentKey}:`, error);
  }
};

// Process WebSocket data
const processWebSocketData = (feeds) => {
  if (!feeds) return;

  const currentTime = Date.now();

  Object.keys(feeds).forEach((instrumentKey) => {
    const state = instrumentStates.get(instrumentKey);
    if (state.status === "closed") {
      return; // Skip processing for closed instruments
    }

    const feed = feeds[instrumentKey];
    const currentLtp = feed?.ltpc?.ltp;

    if (currentLtp) {
      const tradeValue = lastTradeValues.find(
        (item) => item.instrumentKey === instrumentKey
      );

      if (tradeValue) {
        const percentageChange = calculatePercentageChange(
          currentLtp,
          tradeValue.lastTradePrice
        );
        const absPercentageChange = Math.abs(percentageChange);
        const bufferedThreshold = state.previousThreshold - BUFFER_PERCENTAGE;

        console.log(
          `Instrument: ${instrumentKey}, LTP: ${currentLtp}, Previous LTP: ${
            tradeValue.lastTradePrice
          }, % Change: ${percentageChange.toFixed(2)}%, Waiting for: ${
            state.currentThreshold
          }%, Previous: ${
            state.previousThreshold
          }%, Buffer: ${bufferedThreshold}%, Fallback Time: ${
            state.fallbackStartTime
              ? new Date(state.fallbackStartTime).toLocaleTimeString()
              : "null"
          }`
        );

        // Check if above current threshold
        if (absPercentageChange >= state.currentThreshold) {
          const nextThreshold = state.currentThreshold + 5;
          instrumentStates.set(instrumentKey, {
            ...state,
            currentThreshold: nextThreshold,
            previousThreshold: state.currentThreshold,
            fallbackStartTime: null, // Reset fallback timer
          });
          console.log(
            `${instrumentKey} reached ${state.currentThreshold}%. Now waiting for ${nextThreshold}%`
          );
        }
        // Check for fallback below buffered threshold
        else if (
          state.previousThreshold > 0 &&
          absPercentageChange <= bufferedThreshold
        ) {
          // Start or continue fallback
          if (!state.fallbackStartTime) {
            state.fallbackStartTime = currentTime;
            console.log(
              `${instrumentKey} started fallback at ${bufferedThreshold}% at ${new Date(
                currentTime
              ).toLocaleTimeString()}`
            );
          } else if (currentTime - state.fallbackStartTime >= FALLBACK_PERIOD) {
            // Close position after 5 minutes
            console.log(
              `${instrumentKey} sustained ${bufferedThreshold}% for 5 minutes. Closing position.`
            );
            closePosition(instrumentKey);
          }
        } else {
          // Reset fallback if above buffered threshold
          if (state.fallbackStartTime) {
            console.log(
              `${instrumentKey} exceeded ${bufferedThreshold}%. Resetting fallback timer.`
            );
            state.fallbackStartTime = null;
          }
        }

        // Update lastTradePrice
        tradeValue.lastTradePrice = currentLtp;
      }
    }
  });
};

const initializeWebSocket = async (token) => {
  if (streamerInstance) {
    console.log("Reusing existing Upstox WebSocket connection");
    return streamerInstance;
  }

  if (!token) {
    throw new Error("Access token required for WebSocket connection");
  }

  accessToken = token;

  let defaultClient = UpstoxClient.ApiClient.instance;
  let OAUTH2 = defaultClient.authentications["OAUTH2"];
  OAUTH2.accessToken = accessToken;

  streamerInstance = new UpstoxClient.MarketDataStreamerV3(
    instrumentKeys,
    "option_greeks"
  );

  streamerInstance.on("open", () => {
    console.log(
      `Upstox WebSocket connected. Instruments: ${instrumentKeys.length}`
    );
    streamerInstance.subscribe(instrumentKeys, "full");
  });

  streamerInstance.on("message", (data) => {
    const feeds = JSON.parse(data)?.feeds;
    console.log("Received message:", JSON.stringify(feeds));
    processWebSocketData(feeds);
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

initializeWebSocket(token)
  .then(() => console.log("WebSocket initialized successfully"))
  .catch((error) => console.error("Error initializing WebSocket:", error));
