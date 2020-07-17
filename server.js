const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'recipe-journal-db';

// Create a new MongoClient
const client = new MongoClient(url);
let meals;

// Use connect method to connect to the Server
client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const collection = db.collection('meals');
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    meals = docs;
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