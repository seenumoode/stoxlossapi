const axios = require("axios");
const { getCache } = require("./config");
const bcrypt = require("bcrypt");

const username = "seenumoode";
const password = "zaqWDC123s#";

async function generatePasswordHash(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const cache = await getCache();
  await cache.hSet(`user:${username}`, {
    username,
    password: hashedPassword,
  });
  console.log(`Hashed password for ${username}: ${hashedPassword}`);
}

async function checkPassword(username, password) {
  const cache = await getCache();
  const userData = await cache.hGetAll(`user:${username}`);

  // Verify password
  const isMatch = await bcrypt.compare(password, userData.password);
  if (!isMatch) {
    console.log("Invalid username or password");
    return false;
  }

  console.log("Password is valid");
  return true;
}

//checkPassword(username, password);

/*
const apikey =
  "eyJ0eXAiOiJKV1QiLCJrZXlfaWQiOiJza192MS4wIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiIzMkNYMzYiLCJqdGkiOiI2ODQ0ZmQ4MjI1NDU5YTJlZGZlMTliN2UiLCJpc011bHRpQ2xpZW50IjpmYWxzZSwiaXNQbHVzUGxhbiI6ZmFsc2UsImlhdCI6MTc0OTM1MTgxMCwiaXNzIjoidWRhcGktZ2F0ZXdheS1zZXJ2aWNlIiwiZXhwIjoxNzQ5NDIwMDAwfQ.7LowNjFMNAUgDqZufQwJpu99IK6DBl7EZDWw73kmMe0";

const expiryDates = ["2025-04-24", "2025-05-29", "2025-06-26"];
const url = "https://api.upstox.com/v2/option/chain";

const params = {
  instrument_key: "NSE_EQ|INE148O01028",
  expiry_date: expiryDates[2],
};
const optionHeaders = {
  Accept: "application/json",
  Authorization: `Bearer ${apikey}`,
};

axios
  .get(url, { params, headers: optionHeaders })
  .then((response) => {
    let dataa = response?.data?.data;
    console.log(JSON.stringify(dataa, null, 2));
  })
  .catch((error) => {
    console.error("Error:", error);
  });
*/

async function getHistoricalTrades() {
  const endDate = "2025-06-19"; // Get formattedDate as endDate from query params
  let cachedAuth = "";
  const cache = await getCache();
  let apikey =
    "eyJ0eXAiOiJKV1QiLCJrZXlfaWQiOiJza192MS4wIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiIzMkNYMzYiLCJqdGkiOiI2ODUzNzZhY2M3ZGY1ODY5ZGNkMzE2NWUiLCJpc011bHRpQ2xpZW50IjpmYWxzZSwiaXNQbHVzUGxhbiI6ZmFsc2UsImlhdCI6MTc1MDMwMDMzMiwiaXNzIjoidWRhcGktZ2F0ZXdheS1zZXJ2aWNlIiwiZXhwIjoxNzUwMzcwNDAwfQ.C9LxkN9IN_Rmxpkl_uHDaBjLM9R2rqaoxM5MOidjAss";
  cachedAuth = await cache.get("auth");
  console.log("Cached Auth:", cachedAuth);

  const url = "https://api.upstox.com/v2/charges/historical-trades";
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${cachedAuth}`,
  };

  const params = {
    segment: "FO",
    start_date: "2025-06-01",
    end_date: endDate,
    page_number: "1",
    page_size: "100",
  };

  axios
    .get(url, {
      headers: headers,
      params: params,
    })
    .then((response) => {
      // Send data.data if exists, else empty array
      console.log(response.data || []);
    })
    .catch((error) => {
      console.error("Error fetching historical trades:", error);
      // Handle error appropriately}
    });
  // Send data.data if exists, else empty array
  //console.log(response.data || []);
}

getHistoricalTrades();
