const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  fullname: {
    type: String, 
    required: true,
  },
  birthday: {
    type: Date,
  },
  phone: {
    type: Number
  },
  address: [{
    type: String
  }],
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId;
    }
  },
  googleId: {
    type: String,
    default: null
  },
  avatar: {
    type: String,
    default: null
  },
  photos: [
    {
      type: String
    }
  ],
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  date: {
    type: Date,
    default: Date.now
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  status: {
    type: Number,
    enum: [1, 2], // 1: active, 2: block
    default: 1
  },
});

module.exports = mongoose.model('User', UserSchema)