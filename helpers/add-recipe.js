module.exports = (client, dbName, data) => {
  const db = client.db(dbName);
  const collection = db.collection('recipes')
  return collection.insertOne(data)
}