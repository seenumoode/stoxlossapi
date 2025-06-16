// data/marketData.js
const nseFoNames = require("./nseFoNames");
const gainers = require("./gainers");
const losers = require("./losers");
const moment = require("moment-timezone");

//gainers = await getCache().get("gainerYes");

//losers = await getCache().get("loserYes");

let allStocks = [];

// Extract instrument keys and create asset map
const instrumentKeys = nseFoNames.map((item) => item.asset_key);
const assetMap = new Map(
  nseFoNames.map(({ asset_key, name }) => [asset_key, name])
);

// Shared data
const percentageChangeMap = new Map();

const processMap = async (cache, db, stockClosed, getUIWebSocket) => {
  const positiveChanges = [];
  const negativeChanges = [];

  const gainer = await cache.get("gainerYes");

  const loser = await cache.get("loserYes");

  //console.log("Gainer", gainer);
  //console.log("Loser", loser);

  allStocks = [...JSON.parse(gainer), ...JSON.parse(loser)];
  // console.log("All Stocks", allStocks);
  // Divide Map into positive and negative arrays
  for (const [instrumentKey, obj] of percentageChangeMap) {
    if (obj.percentageChange > 0) {
      const name = assetMap.get(instrumentKey);
      positiveChanges.push({
        instrumentKey,
        name,
        percentageChange: obj.percentageChange,
        open: obj?.open,
        high: obj?.high,
        low: obj?.low,
        close: obj?.close,
      });
    } else if (obj.percentageChange < 0) {
      const name = assetMap.get(instrumentKey);
      negativeChanges.push({
        instrumentKey,
        name,
        percentageChange: obj.percentageChange,
        open: obj?.open,
        high: obj?.high,
        low: obj?.low,
        close: obj?.close,
      });
    }
  }

  // Sort positiveChanges in descending order
  positiveChanges.sort((a, b) => b.percentageChange - a.percentageChange);

  // Sort negativeChanges in ascending order
  negativeChanges.sort((a, b) => a.percentageChange - b.percentageChange);

  const todayData = [...positiveChanges, ...negativeChanges];

  todayData.forEach((ele) => {
    var foundIndex = allStocks.findIndex(
      (x) => x.instrumentKey == ele.instrumentKey
    );
    if (foundIndex !== -1) {
      allStocks[foundIndex].data.unshift({
        date: new Date().getTime(),
        open: ele.open ? ele.open : 0,
        high: ele.high ? ele.high : 0,
        low: ele.low ? ele.low : 0,
        close: ele.close ? ele.close : 0,
        percentageChange: ele.percentageChange,
        name: ele.name,
      });
      allStocks[foundIndex].percentageChange = ele.percentageChange;
      allStocks[foundIndex].open = ele.open;
      allStocks[foundIndex].high = ele.high;
      allStocks[foundIndex].low = ele.low;
      allStocks[foundIndex].close = ele.close;
      allStocks[foundIndex].data.pop();
    }
  });

  const gainersData = allStocks.filter((ele) => ele.percentageChange >= 0);
  const losersData = allStocks.filter((ele) => ele.percentageChange < 0);

  gainersData.sort((a, b) => b.percentageChange - a.percentageChange);
  losersData.sort((a, b) => a.percentageChange - b.percentageChange);

  //console.log("Gainers", gainersData);
  //console.log("Losers", losersData);
  await cache.set("gainers", JSON.stringify(gainersData), {
    EX: stockClosed ? 64800 : 300,
  }); // 5 minutes
  await cache.set("losers", JSON.stringify(losersData), {
    EX: stockClosed ? 64800 : 300,
  });

  try {
    const wss = getUIWebSocket();
    const data = {
      source: "webSocket",
      gainers: gainersData,
      losers: losersData,
    };
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
      console.log("Client Sent");
    });
  } catch (err) {
    console.log("Error in UI WebSocket", err);
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const istDate = moment.tz("Asia/Kolkata").startOf("day").toDate();

  const collection = db.collection("stoxdata");
  const updated = new Date();
  collection.createIndex({ date: 1, type: 1 }, { unique: true });
  let query = { date: istDate, type: "loser" };
  let update = {
    $set: { date: istDate, type: "loser", data: losersData, updated: updated },
  };
  const options = { upsert: true };
  collection.updateOne(query, update, options);

  collection.createIndex({ date: 1, type: 1 }, { unique: true });
  query = { date: istDate, type: "gainer" };
  update = {
    $set: {
      date: istDate,
      type: "gainer",
      data: gainersData,
      updated: updated,
    },
  };

  collection.updateOne(query, update, options);

  // Optionally save to files (uncomment if needed)
  /*
    const fs = require("fs");
    fs.writeFileSync("gainerToday.js", JSON.stringify(gainersData, null, 2));
    fs.writeFileSync("loserToday.js", JSON.stringify(losersData, null, 2));
    */
};

module.exports = {
  instrumentKeys,
  percentageChangeMap,
  assetMap,
  processMap,
};
