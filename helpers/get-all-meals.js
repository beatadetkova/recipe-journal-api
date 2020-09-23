module.exports = async (client, dbName) => {
  const db = client.db(dbName);
  const collection = db.collection('meals');
  return collection.find({}).toArray();
};
