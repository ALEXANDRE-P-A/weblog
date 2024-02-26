require("dotenv").config();

const express = require("express");
const path = require("path");

const PORT = process.env.PORT || 3000;

const app = express();

app.set("view engine", "ejs");
app.use("/public", express.static(path.join(__dirname, "/public")));

app.use("/", require("./routes/index.js"));

app.listen(PORT, _ => {
  console.log(`Application listening at http://127.0.0.1:${PORT}`);
});