/*
https://www.mongodb.com/docs/drivers/node/current/usage-examples/count/
*/

const { CONNECT_URL, DATABASE } = require("../../config/mongodb.config.js");

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = CONNECT_URL || "mongodb://root:safada_42@127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.3";

(async _ => {
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

    /* Print the estimate of the number of documents in the "posts" collection */
    const estimate = await col.estimatedDocumentCount();
    console.log(`Estimated number of documents in the movies collection: ${estimate}`);

    /* Print the number of documents in the "posts" collection that match the specified query */
    const keyword = "の世界へ";
    const regexp = new RegExp(`.*${keyword}.*`);
    const query = {
      $or: [{ title: regexp }, { content: regexp }]
    };
    const countDocumentContainKeyword = await col.countDocuments(query);
    console.log(`Number of documents countain the keyword '${keyword}': ${countDocumentContainKeyword}`);

  } catch(err) {
    console.log(err);
  } finally {
    await client.close();
  }
})();