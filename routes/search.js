const router = require("express").Router();

router.get("/*", (req, res) => {
  const keyword = req.query.keyword || "";

  res.render("./search/list.ejs", { keyword });
});

module.exports = router;