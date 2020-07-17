const express = require('express');
const app = express();
const cors = require('cors');
const meals = require('./meals.json');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'recipe-journal-db';

// Create a new MongoClient
const client = new MongoClient(url);

const findDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('meals');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}

// Use connect method to connect to the Server
client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);
  findDocuments(db, function() {

  // Creating documents inside of meals
  // db.collection('meals').insertMany([
  //   {a : 1}, {a : 2}, {a : 3}
  // ], function (err, res) {
  //   console.log(err, res)
  // }); 

  client.close();
  });
});



app.use(cors());
app.use(express.json());

//setting the port.
app.set('port', process.env.PORT || 5000);

app.get('/meals',(req, res) => {
 res.json(meals);
});

app.get(`/meals/:id/recipes`, (req, res) => {
  const id = req.params.id;
  const recipes = require('./recipes.json');
  res.json(recipes[id]);
});

app.post('/meals/:id/recipes/add', function (req, res) {
  const mealId = req.params.id;
  var recipes = require('./recipes.json');
  var body = req.body;
  if (!body.recipeName) {
    res.status(400).json({ message: 'Recipe name missing' })
    return
  }
  body.id = Date.now();
  recipes[mealId] = recipes[mealId].concat([body]);
  fs.writeFileSync('recipes.json', JSON.stringify(recipes, null, 4));
  res.json(recipes[mealId])
});

//Binding to localhost://5000
app.listen(5000,() => {
 console.log('Express server started at port 5000');
});