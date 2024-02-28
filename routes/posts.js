const { CONNECT_URL, DATABASE } = require("../config/mongodb.config.js");

const router = require("express").Router();
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = CONNECT_URL || "mongodb://root:safada_42@127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.3";

router.get("/*", async (req, res) => {
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
    const doc = await col.findOne({
      url: req.url
    });
    res.render("./posts/index.ejs", doc);
  } catch(err) {
    console.log(err);
  } finally {
    await client.close();
  }
});

module.exports = router;