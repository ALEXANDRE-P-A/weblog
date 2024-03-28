const { CONNECT_URL, DATABASE } = require("../../config/mongodb.config.js");

const router = require("express").Router();
const { MongoClient, ServerApiVersion } = require("mongodb");
const tokens = new require("csrf")();

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

router.get("/regist/input", (req, res) => {
  tokens.secret((error, secret) => {
    let token = tokens.create(secret);
    req.session._csrf = secret;
    res.cookie("_csrf", token);
    res.render("./account/posts/regist-form.ejs");
  });
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

router.post("/regist/execute", async (req, res) => {

  const secret = req.session._csrf;
  const token = req.cookies._csrf;

  if(tokens.verify(secret, token) === false)
    throw new Error("Invalid Token.");
  
  const original = createRegistData(req.body);
  const errors = validateRegistData(req.body);

  if(errors){
    res.render("./account/posts/regist-form.ejs", { errors, original });
    return;
  }

  const uri = CONNECT_URL || "mongodb://root:safada_42@127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.3";

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    } 
  });

  try {
    await client.connect();
    const db = client.db(DATABASE);
    await db.collection("posts").insertOne(original);
    delete req.session._csrf;
    res.clearCookie("_csrf");
    res.render("./account/posts/regist-complete.ejs");
  } catch(err) {
    console.log(err);
  } finally {
    await client.close();
  }
});

module.exports = router;