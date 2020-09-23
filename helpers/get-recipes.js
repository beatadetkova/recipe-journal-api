module.exports = (client, dbName, mealId) => {
  const db = client.db(dbName);
  const collection = db.collection('recipes');
  return collection.find({ mealId }).toArray();
};
