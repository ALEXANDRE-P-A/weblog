require("dotenv").config();

module.exports = {
  CONNECT_URL: process.env.MONGODB_CONNECT_URL,
  DATABASE: "weblog-sample",
};