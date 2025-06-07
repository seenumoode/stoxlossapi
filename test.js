const {
  isTodayWorkingDay,
  getPreviousWorkingDay,
  isStockTimings,
} = require("./utils/utils");

console.log(isTodayWorkingDay());
console.log(getPreviousWorkingDay()); // Example date
console.log(isStockTimings()); // Check if current time is within stock market timings

const axios = require("axios");

const url = "https://api.upstox.com/v2/trade/profit-loss/data";
const headers = {
  Accept: "application/json",
  Authorization:
    "Bearer eyJ0eXAiOiJKV1QiLCJrZXlfaWQiOiJza192MS4wIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiIzMkNYMzYiLCJqdGkiOiI2ODQyNmFhMTVhMGZiMDZlNTdiOGYyYmEiLCJpc011bHRpQ2xpZW50IjpmYWxzZSwiaXNQbHVzUGxhbiI6ZmFsc2UsImlhdCI6MTc0OTE4MzEzNywiaXNzIjoidWRhcGktZ2F0ZXdheS1zZXJ2aWNlIiwiZXhwIjoxNzQ5MjQ3MjAwfQ.vnqF-YOqHSowXorYqdF227ltc1eXVMrX30KvqtbNWTk",
};

const params = {
  from_date: "01-06-2025",
  to_date: "07-06-2025",
  segment: "FO",
  financial_year: "2526",
  page_number: "1",
  page_size: "4",
};

axios
  .get(url, { headers, params })
  .then((response) => {
    console.log(response.status);
    console.log(response.data);
  })
  .catch((error) => {
    console.error("Error:", error.message || error);
  });
