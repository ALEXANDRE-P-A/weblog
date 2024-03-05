const router = require("express").Router();

const createRegistData = body => {
  
};

const validateRegistData = body => {
  
};

router.get("/regist", (req, res) => {
  res.render("./account/posts/register-form.ejs");
});

router.post("/regist/input", (req, res) => {
  const original = createRegistData(req.body);
  res.render("./account/posts/register-form.ejs", { original });
});

router.post("/regist/confirm", (req, res) => {
  console.log(req.body);
  res.send("confirm");
});

module.exports = router;