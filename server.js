const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const port = process.env.PORT || 5000
const MongoClient = require('mongodb').MongoClient;
const getAllMeals = require('./helpers/get-all-meals.js')

const dbOpts = {
  url: 'mongodb://localhost:27017',
  dbName: 'recipe-journal-db'
}

// Create a new MongoClient
const client = new MongoClient(dbOpts.url, { useUnifiedTopology: true });
let meals;

app.use(cors());
app.use(express.json());

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
app.listen(port, async () => {
  meals = await getAllMeals(client, dbOpts.dbName)
  console.log(`Express server started at port ${port}`);
});