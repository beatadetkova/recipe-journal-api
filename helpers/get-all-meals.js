module.exports = async (client, dbName) => {
    const meals = await client.connect()
        .then(() => {
            const db = client.db(dbName);
            const collection = db.collection('meals');
            return collection.find({}).toArray()
        })
    client.close()
    return meals
}