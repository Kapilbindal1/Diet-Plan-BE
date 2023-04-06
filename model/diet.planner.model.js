const mongoose = require('mongoose');

const dietPlannerSchema = new mongoose.Schema({
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
  dietPlan: {
    type: String,
    required: true
  },
  fitnessGoals: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('DietPlanner', dietPlannerSchema);
