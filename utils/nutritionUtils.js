const R = require('ramda');
// Fonctionles totaux nutritionnels
const calculateTotals = (meals) => R.reduce(
  (acc, meal) => ({
    calories: acc.calories + meal.calories,
    proteins: acc.proteins + meal.proteins,
    carbs: acc.carbs + meal.carbs,
    fats: acc.fats + meal.fats
  }),
  { calories: 0, proteins: 0, carbs: 0, fats: 0 },
  meals
);
module.exports = {
  calculateTotals
};