require('dotenv').config();
const { MongoClient } = require('mongodb');
// const authMiddleware=require('./authMiddleware');

const mongo_uri = process.env.MONGO_URI;

async function new_database_connection() {
  const mongo_client = new MongoClient(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await mongo_client.connect();
    console.log('created_a_db_connection');
    return mongo_client;
  } catch (error) {
    console.error(error);
  }
};
function close_database_connection(cli) {
    cli.close();
    console.log('closed_a_db_connection');
};

module.exports = {
  new_database_connection,
  close_database_connection
};
