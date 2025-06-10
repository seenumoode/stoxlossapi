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

checkPassword(username, password);

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
