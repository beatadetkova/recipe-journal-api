const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const port = process.env.PORT || 5000
const MongoClient = require('mongodb').MongoClient;
const getAllMeals = require('./helpers/get-all-meals.js');
const getRecipes = require('./helpers/get-recipes.js');
const addOneRecipe = require('./helpers/add-recipe.js');
const { match } = require('assert');

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

app.get(`/meals/:mealName/recipes`, async (req, res) => {
  const matchingMeal = meals.find(meal => meal.name === req.params.mealName);
  const recipes = await getRecipes(client, dbOpts.dbName, matchingMeal._id);
  res.json(recipes);
});

// app.post('/meals/:mealId/recipes/add', function (req, res) {
  // 1. find mealId
  // 2. then I can build object of mealId and name
  // 3. call your addRecipe and inject specific object which was created one step before
  // 4. (careful - async) 
  // 5. reuse mealId from step one to call get-recipes
  // 6. send res.json
  
//   const oneRecipe = await addOneRecipe (client, dbOpts.dbName, req.params.mealId);
//   var body = req.body;
//   if (!body.recipeName) {
//     res.status(400).json({ message: 'Recipe name missing' })
//     return
//   }
//   body.id = Date.now();
//   recipes[mealId] = recipes[mealId].concat([body]);
//   fs.writeFileSync('recipes.json', JSON.stringify(recipes, null, 4));
//   res.json(oneRecipe)
// });

//Binding to localhost://5000
app.listen(port, async () => {
  await client.connect()
  meals = await getAllMeals(client, dbOpts.dbName)
  console.log(`Express server started at port ${port}`);
});

process.on('beforeExit', async () => {
  await client.close()
})
