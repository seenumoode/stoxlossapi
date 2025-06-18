const UpstoxClient = require("upstox-js-sdk");
const axios = require("axios");
const { getCache } = require("./config");

// Track state for each instrument
const instrumentStates = new Map();

const BUFFER_PERCENTAGE = 2; // 2% buffer below previousThreshold
const FALLBACK_PERIOD = 300000; // 5 minutes in milliseconds
const PRICE_MARKUP = 1.01; // 1% markup for limit order price

let streamerInstance = null;
let accessToken = null;

let token = "";

const BASE_URL = "https://api.upstox.com/v2";

// Calculate percentage change
const calculatePercentageChange = (currentPrice, referencePrice) => {
  if (referencePrice === 0) return 0;
  return ((currentPrice - referencePrice) / referencePrice) * 100;
};

// Fetch position details via REST
const getPositions = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/portfolio/short-term-positions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Api-Version": "2.0",
          Accept: "application/json",
        },
      }
    );
    console.log("Positions:", JSON.stringify(response.data, null, 2)); // Debug positions
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching positions:", error.message);
    return [];
  }
};

// Initialize instrument states from positions
const initializeInstrumentStates = async () => {
  const positions = await getPositions();
  const activeInstruments = [];

  positions.forEach((position) => {
    const instrumentKey = position.instrument_token;
    if (position.quantity !== 0) {
      instrumentStates.set(instrumentKey, {
        currentThreshold: 10,
        previousThreshold: 0,
        fallbackStartTime: null,
        status: "open",
        buyPrice: parseFloat(position.buy_price) || 0,
        lastPrice: parseFloat(position.last_price) || 0,
      });
      activeInstruments.push(instrumentKey);
    } else {
      instrumentStates.set(instrumentKey, {
        currentThreshold: 10,
        previousThreshold: 0,
        fallbackStartTime: null,
        status: "closed",
        buyPrice: 0,
        lastPrice: 0,
      });
    }
  });

  return activeInstruments;
};

// Fetch position quantity
const getPositionQuantity = async (instrumentKey) => {
  const positions = await getPositions();
  const position = positions.find(
    (pos) => pos.instrument_token === instrumentKey
  );
  return position ? Math.abs(parseInt(position.quantity)) : 0;
};

// Close position via REST with Limit order
const closePosition = async (instrumentKey) => {
  try {
    const quantity = await getPositionQuantity(instrumentKey);
    const state = instrumentStates.get(instrumentKey);

    if (quantity === 0 || !state) {
      console.log(`No open position or state for ${instrumentKey}`);
      instrumentStates.set(instrumentKey, {
        currentThreshold: 10,
        previousThreshold: 0,
        fallbackStartTime: null,
        status: "closed",
        buyPrice: 0,
        lastPrice: 0,
      });
      if (streamerInstance) {
        streamerInstance.unsubscribe([instrumentKey]);
        console.log(`Unsubscribed from WebSocket for ${instrumentKey}`);
      }
      return;
    }

    // Calculate limit price
    const bufferedThreshold = state.previousThreshold - BUFFER_PERCENTAGE;
    const fallbackPrice = state.buyPrice * (1 + bufferedThreshold / 100);
    let limitPrice = state.lastPrice > 0 ? state.lastPrice : fallbackPrice;
    limitPrice = (limitPrice * PRICE_MARKUP).toFixed(2); // 1% markup, rounded to 2 decimals

    const orderDetails = {
      quantity: quantity.toString(),
      product: "D", // Delivery
      validity: "DAY",
      price: limitPrice,
      instrument_token: instrumentKey,
      order_type: "LIMIT",
      transaction_type: "SELL",
      disclosed_quantity: "0",
      trigger_price: "0",
      is_amo: false,
    };

    console.log(`Placing limit order for ${instrumentKey}:`, orderDetails);

    const response = await axios.post(`${BASE_URL}/order/place`, orderDetails, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Api-Version": "2.0",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    console.log(
      `Position closed for ${instrumentKey} (Quantity: ${quantity}):`,
      response.data
    );

    // Verify order status
    const orderId = response.data.data.order_id;
    const orderResponse = await axios.get(
      `${BASE_URL}/order/details/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Api-Version": "2.0",
          Accept: "application/json",
        },
      }
    );
    console.log(`Order status for ${instrumentKey}:`, orderResponse.data);

    instrumentStates.set(instrumentKey, {
      currentThreshold: 10,
      previousThreshold: 0,
      fallbackStartTime: null,
      status: "closed",
      buyPrice: 0,
      lastPrice: 0,
    });

    if (streamerInstance) {
      streamerInstance.unsubscribe([instrumentKey]);
      console.log(`Unsubscribed from WebSocket for ${instrumentKey}`);
    }
  } catch (error) {
    console.error(
      `Error closing position for ${instrumentKey}:`,
      error.message
    );
  }
};

// Process WebSocket data
const processWebSocketData = (feeds) => {
  if (!feeds) return;

  const currentTime = Date.now();

  Object.keys(feeds).forEach((instrumentKey) => {
    const state = instrumentStates.get(instrumentKey);
    if (!state || state.status === "closed") {
      return;
    }

    const feed = feeds[instrumentKey];
    const currentLtp = feed?.ltpc?.ltp;

    if (currentLtp) {
      const percentageChange = calculatePercentageChange(
        currentLtp,
        state.buyPrice
      );

      let updatedState = { ...state };

      // Advance thresholds iteratively
      while (
        percentageChange >= updatedState.currentThreshold &&
        percentageChange > 0
      ) {
        const nextThreshold = updatedState.currentThreshold + 5;
        console.log(
          `${instrumentKey} reached ${updatedState.currentThreshold}%. Now waiting for ${nextThreshold}%`
        );
        updatedState = {
          ...updatedState,
          currentThreshold: nextThreshold,
          previousThreshold: updatedState.currentThreshold,
          fallbackStartTime: null,
          lastPrice: currentLtp,
        };
        instrumentStates.set(instrumentKey, updatedState);
      }

      const bufferedThreshold =
        updatedState.previousThreshold - BUFFER_PERCENTAGE;

      // Fallback logic
      if (
        updatedState.previousThreshold > 0 &&
        percentageChange <= bufferedThreshold
      ) {
        if (!updatedState.fallbackStartTime) {
          updatedState.fallbackStartTime = currentTime;
          console.log(
            `${instrumentKey} started fallback at ${bufferedThreshold}% at ${new Date(
              currentTime
            ).toLocaleTimeString()}`
          );
          instrumentStates.set(instrumentKey, updatedState);
        } else if (
          currentTime - updatedState.fallbackStartTime >=
          FALLBACK_PERIOD
        ) {
          console.log(
            `${instrumentKey} sustained ${bufferedThreshold}% for 5 minutes. Closing position.`
          );
          closePosition(instrumentKey);
          return;
        }
      } else if (updatedState.fallbackStartTime) {
        console.log(
          `${instrumentKey} exceeded ${bufferedThreshold}%. Resetting fallback timer.`
        );
        updatedState.fallbackStartTime = null;
        instrumentStates.set(instrumentKey, updatedState);
      }

      // Update lastPrice
      updatedState.lastPrice = currentLtp;
      instrumentStates.set(instrumentKey, updatedState);

      // Log final state
      console.log(
        `Instrument: ${instrumentKey}, LTP: ${currentLtp}, Buy Price: ${
          updatedState.buyPrice
        }, % Change: ${percentageChange.toFixed(2)}%, Waiting for: ${
          updatedState.currentThreshold
        }%, Previous: ${
          updatedState.previousThreshold
        }%, Buffer: ${bufferedThreshold}%, Fallback Time: ${
          updatedState.fallbackStartTime
            ? new Date(updatedState.fallbackStartTime).toLocaleTimeString()
            : "null"
        }`
      );
      console.log("Final state:", instrumentStates.get(instrumentKey));
    }
  });
};

// Initialize WebSocket
const initializeWebSocket = async () => {
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

  const activeInstruments = await initializeInstrumentStates();
  if (activeInstruments.length === 0) {
    console.log(
      "No open positions found. Waiting for positions to initialize WebSocket."
    );
    return null;
  }

  streamerInstance = new UpstoxClient.MarketDataStreamerV3(
    activeInstruments,
    "ltpc"
  );

  streamerInstance.on("open", () => {
    console.log(
      `Upstox WebSocket connected. Instruments: ${activeInstruments.length}`
    );
    streamerInstance.subscribe(activeInstruments, "ltpc");
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

// Start the application
const startApplication = async () => {
  try {
    const cache = await getCache();
    let cachedAuth = "";
    cachedAuth = await cache.get("auth");
    token = JSON.parse(cachedAuth);

    const streamer = await initializeWebSocket();
    if (streamer) {
      console.log("WebSocket initialized successfully");
    } else {
      setInterval(async () => {
        if (!streamerInstance) {
          console.log("Retrying WebSocket initialization...");
          await initializeWebSocket();
        }
      }, 60000);
    }
  } catch (error) {
    console.error("Error starting application:", error.message);
  }
};

startApplication();
