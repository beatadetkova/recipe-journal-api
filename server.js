const express = require('express');
const app = express();
const cors = require('cors');
const meals = require('./meals');
const recipes = require('./recipes');

app.use(cors());

//setting the port.
app.set('port', process.env.PORT || 5000);

app.get('/meals',(req, res) => {
 res.json(meals);
});

app.get(`/meals/:id`, (req, res) => {
  const id = req.params.id;
  res.json(recipes[id]);
});

//Binding to localhost://5000
app.listen(5000,() => {
 console.log('Express server started at port 5000');
});