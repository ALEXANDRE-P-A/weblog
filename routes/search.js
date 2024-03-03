const { CONNECT_URL, DATABASE } = require("../config/mongodb.config.js");
const { MAX_ITEM_PER_PAGE } = require("../config/app.config.js").search;

const router = require("express").Router();
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = CONNECT_URL || "mongodb://root:safada_42@127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.3";

router.get("/*", async (req, res, next) => {
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const keyword = req.query.keyword || "";

  const regexp = new RegExp(`.*${keyword}.*`);
  const query = {
    $or: [{ title: regexp }, { content: regexp }]
  };

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
    const col = db.collection("posts");

    const count = await col.countDocuments(query);
    const docs = await col.find(query).sort({ published: -1 }).skip((page - 1) * MAX_ITEM_PER_PAGE).limit(MAX_ITEM_PER_PAGE).toArray();

    const data = {
      keyword,
      count,
      docs,
      pagination: {
        max: Math.ceil(count / MAX_ITEM_PER_PAGE),
        current: page
      }
    }
    
    res.render("./search/list.ejs", data);
  } catch(err) {
    console.log(err);
    next(err);
  } finally {
    await client.close();
  }
});

module.exports = router;