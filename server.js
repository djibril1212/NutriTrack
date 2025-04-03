const connectDB = require('./data/connection');
const express = require('express');
const cors = require('cors');
const Meal = require('./models/mealModel');
const Goal = require('./models/goalModel');
const { calculateTotals } = require('./utils/nutritionUtils');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.send('Bienvenue sur NutriTrack API 🍽️');
});
app.post('/meals', (req, res) => {
    const { name, calories, proteins, carbs, fats } = req.body;
    if (!name || !calories || !proteins || !carbs || !fats) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }
    const newMeal = new Meal({ name, calories, proteins, carbs, fats });
    newMeal.save()
        .then(() => res.status(201).json(newMeal))
        .catch((error) => res.status(500).json({ message: 'Erreur lors de la création du repas.', error }));
});
app.get('/meals', (req, res) => {
    Meal.find()
        .then((meals) => res.json(meals))
        .catch((error) => res.status(500).json({ message: 'Erreur lors de la récupération des repas.', error }));
});
// GET les objectifs
app.get('/goals', async (req, res) => {
    try {
      const goals = await Goal.find();
      res.status(200).json(goals);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des objectifs.', error });
    }
  });
  // PUT les objectifs
  app.put('/goals', async (req, res) => {
    const { dailyCalories, dailyProteins, dailyCarbs, dailyFats } = req.body;
  
    if (!dailyCalories || !dailyProteins || !dailyCarbs || !dailyFats) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }
  
    try {
      let goal = await Goal.findOne();
      if (goal) {
        goal.dailyCalories = dailyCalories;
        goal.dailyProteins = dailyProteins;
        goal.dailyCarbs = dailyCarbs;
        goal.dailyFats = dailyFats;
      } else {
        goal = new Goal({ dailyCalories, dailyProteins, dailyCarbs, dailyFats });
      }
      await goal.save();
      res.status(200).json(goal);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour des objectifs.', error });
    }
  });

  app.get('/meals/today', async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
  
      const todayMeals = await Meal.find({
        date: { $gte: today, $lt: tomorrow }
      });
  
      const totals = calculateTotals(todayMeals);
  
      res.status(200).json({ totals, count: todayMeals.length, meals: todayMeals });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors du calcul des apports journaliers.', error });
    }
  });

  app.get('/meals/today/compare', async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const todayMeals = await Meal.find({
        date: { $gte: today, $lt: tomorrow }
      });
      const goals = await Goal.findOne(); 
      if (!goals) {
        return res.status(404).json({ message: 'Objectifs non définis.' });
      }
      const totals = calculateTotals(todayMeals);
      const progress = {
        calories: `${((totals.calories / goals.dailyCalories) * 100).toFixed(1)}%`,
        proteins: `${((totals.proteins / goals.dailyProteins) * 100).toFixed(1)}%`,
        carbs: `${((totals.carbs / goals.dailyCarbs) * 100).toFixed(1)}%`,
        fats: `${((totals.fats / goals.dailyFats) * 100).toFixed(1)}%`
      };
      res.status(200).json({
        totals,
        goals: {
          calories: goals.dailyCalories,
          proteins: goals.dailyProteins,
          carbs: goals.dailyCarbs,
          fats: goals.dailyFats
        },
        progress
      });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la comparaison avec les objectifs.', error });
    }
  });
connectDB();
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});