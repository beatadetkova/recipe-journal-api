const express = require('express');

const app = express();
const cors = require('cors');

const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
const getAllMeals = require('./helpers/get-all-meals.js');
const getRecipes = require('./helpers/get-recipes.js');
const addRecipe = require('./helpers/add-recipe.js');
const getMatchingMeal = require('./helpers/get-matching-meal.js');

const dbOpts = {
  url: 'mongodb://localhost:27017',
  dbName: 'recipe-journal-db',
};

// Create a new MongoClient
const client = new MongoClient(dbOpts.url, { useUnifiedTopology: true });
let meals;

app.use(cors());
app.use(express.json());

app.get('/meals', (req, res) => {
  res.json(meals);
});

app.get('/meals/:mealName/recipes', async (req, res) => {
  const matchingMeal = getMatchingMeal(meals, req.params.mealName);
  const recipes = await getRecipes(client, dbOpts.dbName, matchingMeal.id);
  res.json(recipes);
});

app.post('/meals/:mealName/recipes/add', async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: 'Empty body' });
  } else {
    const matchingMeal = getMatchingMeal(meals, req.params.mealName);
    const data = {
      ...req.body,
      mealId: matchingMeal.id,
    };
    console.log(data);
    await addRecipe(client, dbOpts.dbName, data);
    const recipes = await getRecipes(client, dbOpts.dbName, matchingMeal.id);
    res.json(recipes);
  }
});

// Binding to localhost://5000
app.listen(port, async () => {
  await client.connect();
  meals = await getAllMeals(client, dbOpts.dbName);
  console.log(`Express server started at port ${port}`);
});

process.on('beforeExit', async () => {
  await client.close();
});
