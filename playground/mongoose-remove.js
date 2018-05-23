const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Remove all todos
// Todo.remove({}).then((result)=>{
//   console.log(result);
// });

// Remove one todo by it's ID
Todo.findByIdAndRemove('5b04f020247d85540ad1bc2a').then((result)=>{
  console.log(result);
});