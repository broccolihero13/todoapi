const mongoose = require('mongoose');

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
    type: String
  }, password: {
    required: false,
    type: String
  }
});

module.exports = {User}