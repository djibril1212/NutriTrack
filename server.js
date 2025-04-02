const connectDB = require('./data/connection');
const express = require('express');
const cors = require('cors');
const Meal = require('./models/mealModel');
const Goal = require('./models/goalModel');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


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


  
connectDB();
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});