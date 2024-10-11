const mongoose = require('mongoose')

const PaymentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
})

module.exports = mongoose.model('Payment', PaymentSchema)