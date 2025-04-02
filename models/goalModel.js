const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  dailyCalories: { type: Number, required: true },
  dailyProteins: { type: Number, required: true },
  dailyCarbs: { type: Number, required: true },
  dailyFats: { type: Number, required: true }
});

module.exports = mongoose.model('Goal', goalSchema);