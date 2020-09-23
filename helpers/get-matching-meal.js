const match = (mealName) => (meal) => meal.name === mealName;

module.exports = (meals, mealName) => meals.find(match(mealName));
