const express = require('express');
const app = express();
const cors = require('cors');
const meals = require('./meals.json');
const fs = require('fs');

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
  body.id = Date.now();
  recipes[mealId] = recipes[mealId].concat([body]);
  fs.writeFileSync('recipes.json', JSON.stringify(recipes, null, 4));
  res.json(recipes[mealId])
});

//Binding to localhost://5000
app.listen(5000,() => {
 console.log('Express server started at port 5000');
});