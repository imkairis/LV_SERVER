const mongoose = require('mongoose');
const DonationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  gender: { // Thêm trường giới tính
    type: String,
    // Giới hạn giá trị
    required: true,
  },
  age: {
    type: Number,
    required: true
  },
  historyOfIssue: {
    type: String,
    required: true
  },
  currentIssue: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: false
  },
  images: [{
    type: String
  }],
  description: String,
  createDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Donation', DonationSchema);
