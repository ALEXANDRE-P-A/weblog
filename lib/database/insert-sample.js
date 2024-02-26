const { CONNECT_URL, DATABASE } = require("../../config/mongodb.config.js");

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = CONNECT_URL || "mongodb://root:safada_42@127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.3";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const insertPosts = db => {
  return Promise.all([
    db.collection("posts")
      .insertMany([{
        url: "/2017/05/hello-nodejs.html",
        published: new Date(2017, 4, 2),
        updated: new Date(2017, 4, 2),
        title: "ようこそ Node.js の世界へ",
        content: "Node.js は おもしろい！",
        keywords: ["Node.js"],
        authors: ["Yuta Sato"]
      },{
        url: "/2017/06/nodejs-basic.html",
        published: new Date(2017, 5, 12),
        updated: new Date(2017, 5, 12),
        title: "Node.js の 基本",
        content: "ちょっと難しくなってきた！？",
        keywords: ["Node.js"],
        authors: ["Yuta Sato"]
      },{
        url: "/2017/07/advanced-nodejs.html",
        published: new Date(2017, 7, 8),
        updated: new Date(2017, 7, 8),
        title: "Node.js 応用",
        content: "Node.js で Excel ファイルが触れるなんて！！",
        keywords: ["Node.js"],
        authors: ["Yuta Sato"]
      }]),
    db.collection("posts")
      .createIndex({ url: 1 }, { unique: true, background: true })
  ]);
};

const insertUsers = db => {
  return Promise.all([
    db.collection("users").insertOne({
      email: "alexandrepereiraassano@gmail.com",
      name: "Alexandre PA",
      password: "qwerty",
      role: "owner"
    }),
    db.collection("users")
      .createIndex({ email: 1 }, { unique: true, background: true })
  ]);
};

const insertPrivileges = db => {
  return Promise.all([
    db.collection("privileges").insertMany([
      { role: "default", permissions: ["read"] },
      { role: "owner", permissions: ["readWrite"] }
    ]),
    db.collection("privileges")
      .createIndex({ role: 1 }, { unique: 1, background: 1 })
  ]);
};

const execute = async _ => {
  await client.connect();
  const db = client.db(DATABASE);
  Promise.all([
    insertPosts(db),
    insertUsers(db),
    insertPrivileges(db)
  ]).catch(err => {
    console.log(err, "Execution failed.");
  }).then(_ => {
    console.log("Execution success.");
    client.close();
  })
};

execute();