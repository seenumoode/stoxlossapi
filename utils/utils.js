const moment = require("moment-timezone");
const holidays = [
  "2025-02-26",
  "2025-03-14",
  "2025-03-31",
  "2025-04-10",
  "2025-04-14",
  "2025-04-18",
  "2025-05-01",
  "2025-08-15",
  "2025-08-27",
  "2025-10-02",
  "2025-10-22",
  "2025-11-05",
  "2025-12-25",
];

function isStockTimings() {
  const now = moment().tz("Asia/Kolkata");
  const currentTime = now.format("HH:mm:ss");
  //console.log("Current IST time:", currentTime);

  // Define the time range
  const startTime = moment.tz("09:15:00", "HH:mm:ss", "Asia/Kolkata");
  const endTime = moment.tz("15:30:00", "HH:mm:ss", "Asia/Kolkata");

  // Check if current time is between 9:15 AM and 3:30 PM
  const isBetween = now.isBetween(startTime, endTime, null, "[]"); // '[]' makes it inclusive
  return isBetween;
}

function getPreviousWorkingDay() {
  let currentDate = moment
    .tz("Asia/Kolkata")
    .subtract(1, "days")
    .startOf("day");

  // Keep subtracting days until a working day is found
  while (true) {
    let isWeekend = currentDate.day() === 0 || currentDate.day() === 6; // Sunday or Saturday
    let isHoliday = holidays.includes(currentDate.format("YYYY-MM-DD"));

    if (!isWeekend && !isHoliday) {
      break; // Found a working day
    }
    currentDate = currentDate.subtract(1, "days").startOf("day");
  }

  return currentDate.toDate();
}

function isTodayWorkingDay() {
  const today = moment.tz("Asia/Kolkata").startOf("day");
  const isWeekend = today.day() === 0 || today.day() === 6; // Sunday or Saturday
  const isHoliday = holidays.includes(today.format("YYYY-MM-DD"));
  return !isWeekend && !isHoliday;
}

module.exports = {
  getPreviousWorkingDay,
  isTodayWorkingDay,
  isStockTimings,
};
