const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

let id = `5afc5585901513445fddd0ce`;

if(!ObjectID.isValid(id)){
  console.log('ID not valid');
}

User.findById(id).then((user)=>{
  if(!user){
    return console.log(`ID ${id} not found`);
  }
  console.log(`You selected the User: ${user}`);
}).catch((err)=>console.log(err.message));
// Todo.find({_id: id}).then((todo)=>{
//   if(!todo){
//     return console.log(`ID ${id} not found`);
//   }
//   console.log(`You selected the Todo: ${todo}`);
// }).catch((err)=>{
//   console.log(err.message);
// });

// Todo.findById(id).then((todo)=>{
//   if(!todo){
//     return console.log(`ID ${id} not found`);
//   }
//   console.log(`You selected the Todo: ${todo}`);
// }).catch((err)=>console.log(err.message));

