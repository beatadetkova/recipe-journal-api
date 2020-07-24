module.exports = (meals, mealName) => {
  return meals.find(meal => meal.name === mealName);
}