require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

const logger = require("./lib/log/logger.js");
const applicationlogger = require("./lib/log/applicationlogger.js");
const accesslogger = require("./lib/log/accesslogger.js");

const { SESSION_SECRET } = require("./config/app.config.js").security;

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// set view engine
app.set("view engine", "ejs");
app.disable("x-powered-by");

// static resources
app.use("/public", express.static(path.join(__dirname, "/public")));

// set accesslogger
app.use(accesslogger());

// set cookie
app.use(cookieParser());

// set flash
app.use(flash());

// set session
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  name: "atoviag_sid"
}));

// set routes
app.use("/", require("./routes/index.js"));
app.use("/posts/", require("./routes/posts.js"));
app.use("/search/", require("./routes/search.js"));
app.use("/account/", require("./routes/account/account.js"));

// set application logger
app.use(applicationlogger());
  
// application listen
app.listen(PORT, _ => {
  logger.application.info(`Application listening at http://127.0.0.1:${PORT}`);
});