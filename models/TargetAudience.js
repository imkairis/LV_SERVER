const mongoose = require('mongoose');

const TargetAudienceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String
  }
});

module.exports = mongoose.model('TargetAudience', TargetAudienceSchema);
