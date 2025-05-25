const {
  isTodayWorkingDay,
  getPreviousWorkingDay,
  isStockTimings,
} = require("./utils/utils");

console.log(isTodayWorkingDay());
console.log(getPreviousWorkingDay()); // Example date
console.log(isStockTimings()); // Check if current time is within stock market timings
