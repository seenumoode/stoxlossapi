// cron/jobs.js
const cron = require("node-cron");
const { getDb, getCache, getWebSocket } = require("../config");
const { processMap } = require("../data/marketData");

async function getYesterdayData() {
  try {
    const db = await getDb();
    const cache = await getCache();

    const now = new Date();
    now.setDate(now.getDate() - 1);
    now.setHours(0, 0, 0, 0);

    const collection = db.collection("stoxdata");
    var query = { date: now, type: "loser" };
    collection
      .find(query)
      .toArray()
      .then((i) => {
        cache.set("loserYes", JSON.stringify(i[0].data), { EX: 86400 });
      });

    var query = { date: now, type: "gainer" };
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

function getUpstoxData() {}
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
      if (streamer.isConnected()) {
        console.log("Cron job: WebSocket is active, processing market data");
        // Optionally resubscribe or send messages
        // streamer.subscribe(instrumentKeys, "full");
      }
    } catch (err) {
      console.warn("WebSocket not initialized, skipping WebSocket tasks");
    }

    // Process market data
    processMap(cache, db);

    console.log("Cron job executed: Processed market data");
  } catch (err) {
    console.error("Cron job error:", err);
  }
}

cron.schedule(
  "*/5 * * * *'",
  async () => {
    getData();
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
