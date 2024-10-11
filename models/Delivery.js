const mongoose = require('mongoose')

const DeliverySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    uniqure: true
  },
  description: {
    type: String
  },
  cost: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Delivery', DeliverySchema)