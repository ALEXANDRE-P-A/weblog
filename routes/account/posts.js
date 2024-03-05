const router = require("express").Router();

const createRegistData = body => {
  const dateTime = new Date();
  return {
    url: body.url,
    published: dateTime,
    update: dateTime,
    title: body.title,
    content: body.content,
    keywords: (body.keywords || "").split(","),
    authors: (body.authors || "").split(",")
  }
};

const validateRegistData = body => {
  let isValidated = true, errors = {};

  if(!body.url){
    isValidated = false;
    errors.url = "URL cannot be left empty";
  }

  if(body.url && body.url.substring(0, 1) !== "/"){
    isValidated = false;
    errors.url = "URL must start with character '/'";
  }

  if(!body.title){
    isValidated = false;
    errors.title = "Title cannot be left empty.";
  }

  return isValidated ? undefined : errors;
};

router.get("/regist", (req, res) => {
  res.render("./account/posts/regist-form.ejs");
});

router.post("/regist/input", (req, res) => {
  const original = createRegistData(req.body);
  res.render("./account/posts/regist-form.ejs", { original });
});

router.post("/regist/confirm", (req, res) => {
  const original = createRegistData(req.body);
  const errors = validateRegistData(req.body);

  if(errors){
    res.render("./account/posts/regist-form.ejs", { original, errors });
    return;
  }

  res.render("./account/posts/regist-confirm.ejs", { original });
});

module.exports = router;