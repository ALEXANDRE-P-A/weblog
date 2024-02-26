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

const run = async _ => {
  try {
    await client.connect();
    await client.db(DATABASE).command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }  finally {
    await client.close();
  };
};

run().catch(console.dir);

/*
 how to access mongodb from commenline
  mongosh "mongodb+srv://cluster0.kbno8nb.mongodb.net/" --apiVersion 1 --username <USERNAME> --password <PASSWORD>
reference:
  https://cloud.mongodb.com/v2/64dc95f451f876226cddec2d#/clusters/connect?clusterId=Cluster0  
*/