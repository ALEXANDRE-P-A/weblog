const { CONNECT_URL, DATABASE } = require("../../config/mongodb.config.js");

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = CONNECT_URL || "mongodb://root:safada_42@127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.3";

(async _ => {
  const keyword = "";
  const regexp = new RegExp(`.*${keyword}.*`);

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
    const docs = await col.find({
      $or: [{ title: regexp }, { content: regexp }]
    }).sort({ published: 1 }).toArray();

    const data = {
      keyword,
      docs
    };

    console.log(data);
  } catch(err) {
    console.log(err);
  } finally {
    await client.close();
  }
})();