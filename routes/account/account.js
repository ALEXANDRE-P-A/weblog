const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("./account/index.ejs");
});

router.get("/login", (req, res) => {
  res.render("./account/login.ejs", { message: req.flash("message") });
});

router.use("/posts", require("./posts.js"));

module.exports = router;