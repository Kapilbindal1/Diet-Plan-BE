const mongoose = require('mongoose');

const dietPlannerSchema = new mongoose.Schema({
  userId: {
    type: String, 
    required: true
  },
  age: {
    type: Number,
    required: false
  },
  bmi: {
    type: Number,
    required: false
  },
  weight: {
    type: Number,
    required: false
  },
  height: {
    type: Number,
    required: false
  },
  dietaryPreference: {
    type: String,
    required: true
  },
  allergies: {
    type: String,
    required: true
  },
  cookingMethods: {
    type: String,
    required: true
  },
  fitnessGoals: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('DietPlanner', dietPlannerSchema);
