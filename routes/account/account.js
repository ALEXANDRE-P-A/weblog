const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("./account/index.ejs");
});

router.use("/posts", require("./posts.js"));

module.exports = router;