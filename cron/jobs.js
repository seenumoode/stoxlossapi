// cron/jobs.js
const cron = require("node-cron");
const { getDb, getCache, getWebSocket, getUIWebSocket } = require("../config");
const { processMap } = require("../data/marketData");
const moment = require("moment-timezone");
const {
  isTodayWorkingDay,
  getPreviousWorkingDay,
  isStockTimings,
} = require("../utils/utils");

async function getYesterdayData() {
  try {
    const db = await getDb();
    const cache = await getCache();

    const istDate = getPreviousWorkingDay();

    const collection = db.collection("stoxdata");
    var query = { date: istDate, type: "loser" };
    collection
      .find(query)
      .toArray()
      .then((i) => {
        cache.set("loserYes", JSON.stringify(i[0].data), { EX: 86400 });
      });

    var query = { date: istDate, type: "gainer" };
    collection
      .find(query)
      .toArray()
      .then((i) => {
        cache.set("gainerYes", JSON.stringify(i[0].data), {
          EX: 86400,
        });
      });
  } catch (err) {
    console.error("Cron job error:", err);
  }
}

// Example cron job running every minute
cron.schedule(
  "14 9 * * *",
  () => {
    console.log("Running cron job every minute");
    getYesterdayData();
  },
  {
    timezone: "Asia/Kolkata",
  }
);

async function getData() {
  try {
    const db = await getDb();
    const cache = await getCache();
    let streamer;
    // Access WebSocket if initialized
    try {
      streamer = await getWebSocket();
      if (streamer) {
        console.log("Cron job: WebSocket is active, processing market data");
        // Optionally resubscribe or send messages
        // streamer.subscribe(instrumentKeys, "full");
      }
    } catch (err) {
      console.warn(JSON.stringify(err));
      console.log("Cron job: WebSocket not initialized, initializing now");
    }

    // Process market data
    processMap(cache, db, true, getUIWebSocket);

    console.log("Cron job executed: Processed market data");
  } catch (err) {
    console.error("Cron job error:", err);
  }
}

cron.schedule(
  "*/1 * * * *'",
  async () => {
    if (isTodayWorkingDay() && isStockTimings()) {
      getData();
    } else {
      console.log(
        "Today is a holiday/not stock timing, skipping data processing"
      );
    }
  },
  {
    timezone: "Asia/Kolkata",
  }
);

cron.schedule("0 16-23,0-8 * * *", async () => {}, {
  timezone: "Asia/Kolkata",
});

getYesterdayData();
console.log("Cron jobs scheduled");
