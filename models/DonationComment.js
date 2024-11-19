const mongoose = require('mongoose');

const DonationCommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  },
  donation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation',
    required: true 
  },
  content: {
    type: String,
    required: true, 
    trim: true, 
    maxlength: 1000 
  },
  createdAt: {
    type: Date,
    default: Date.now 
  },
});

module.exports = mongoose.model('DonationComment', DonationCommentSchema);
