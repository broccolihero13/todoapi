const mongoose = require('mongoose');

//save something new

let Todo = mongoose.model('Todo', {
  text: {
    required: true,
    type: String,
    minlength: 1,
    trim: true //get rid of any leading and trailing white space
  },
  status: {
    required: true,
    type: String,
    default: "Open"
  },
  completedAt: {
    type: Date,
    default: null
  },
  _creator: {
    required: true,
    type: mongoose.Schema.Types.ObjectId
  }
});

module.exports = {Todo};