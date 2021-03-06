const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const user1Id = new ObjectID();
const user2Id = new ObjectID();
const users = [
  {
    _id: user1Id,
    email: "brock@notanemailaddress.com",
    username: "brock",
    password: "thisPasswordIsForReal",
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: user1Id, access:'auth'}, process.env.JWT_SECRET).toString()
    }]
  },
  {
    _id: user2Id,
    email: "casey@notanemailaddress.com",
    username: "casey",
    password: "thisPasswordIsNotForReal",
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: user2Id, access:'auth'}, process.env.JWT_SECRET).toString()
    }]
  }
]

const todos = [
  {
    text: 'First test todo', 
    _id: new ObjectID(),
    _creator: user1Id
  },
  {
    text: 'Second test todo',
    _id: new ObjectID(),
    status: "in progress",
    _creator: user2Id
  }
];

const populateTodos = (done)=>{
  Todo.remove({}).then(()=>{
    return Todo.insertMany(todos);
  }).then(()=> done());
}

const populateUsers = (done)=>{
  User.remove({}).then(()=>{
    let userOne = new User(users[0]).save();
    let userTwo = new User(users[1]).save();

    return Promise.all([userOne,userTwo])
  }).then(()=> done());
}

module.exports = {todos, populateTodos, users, populateUsers}