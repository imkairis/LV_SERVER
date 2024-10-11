const mongoose = require('mongoose')

const DeliveryStatusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  nextStatus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryStatus',
    default: null,
  }
})

module.exports = mongoose.model('DeliveryStatus', DeliveryStatusSchema)