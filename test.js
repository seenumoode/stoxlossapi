const UpstoxClient = require("upstox-js-sdk");

// Configuration
const API_KEY = "a1cfd100-f1f7-40df-a575-ac5fbcb84975";
const API_SECRET = "wbuj4bffst";
const REDIRECT_URI = "https://stockloss.com";
const AUTH_CODE = "32CX36";

let upstoxClient = new UpstoxClient.Session(API_KEY, API_SECRET, REDIRECT_URI);

upstoxClient
  .getAccessToken({ code: AUTH_CODE })
  .then((response) => {
    console.log("Access Token:", response.access_token);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
