const mongoose = require('mongoose')

const PaymentStatusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
})

module.exports = mongoose.model('PaymentStatus', PaymentStatusSchema)