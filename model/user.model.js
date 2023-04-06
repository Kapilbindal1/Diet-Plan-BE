const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  number: {
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
  }
});

module.exports = mongoose.model('User', UserSchema);
