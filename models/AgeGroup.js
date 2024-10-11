const mongoose = require('mongoose');

const AgeGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String
  }
});

module.exports = mongoose.model('AgeGroup', AgeGroupSchema);
