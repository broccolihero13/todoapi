const mongoose = require('mongoose');
const validator = require('validator');

let User = mongoose.model('Users', {
  username: {
    required: true,
    type: String,
    minlength: 3,
    trim: true
  }, email: {
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    type: String,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} not a valid email'
    }
  }, password: {
    required: true,
    type: String,
    minlength: 8,
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

module.exports = {User}