const mongoose = require('mongoose');

const dietPlannerSchema = new mongoose.Schema({
  gender: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true
  },
  bmi: {
    type: Number,
    required: false
  },
  weight: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  dietaryPreference: {
    type: String,
    required: false
  },
  allergies: {
    type: String,
    required: false
  },
  cookingMethods: {
    type: String,
    required: false
  },
  fitnessGoals: {
    type: String,
    required: true
  },
  medicalHistory: {
    type: String,
    required: true
  },
  userEmailAddress: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('DietPlanner', dietPlannerSchema);
