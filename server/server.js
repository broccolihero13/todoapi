require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {mongoose} = require('./db/mongoose');

const {ObjectID} = require('mongodb');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

let app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

app.post('/todos',authenticate, (req,res)=>{
  let todo = new Todo({
    text: req.body.text,
    status: req.body.status,
    completedAt: req.body.status === "completed" ? new Date() : null,
    _creator: req.user._id
  });
  todo.save().then((doc)=>{
    res.send(doc);
  }).catch((err)=>{
    res.status(400).send(err);
  })
});

app.get('/todos', authenticate, (req,res)=>{
  Todo.find({_creator:req.user._id}).then((todos)=>{
    res.send({todos});
  }).catch((err)=>res.status(400).send(err));
})

app.get(`/todos/:todo_id`, authenticate,(req,res)=>{
  let id = req.params.todo_id;
  if(!ObjectID.isValid(id)){
    res.status(404).send();
  }
  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo)=>{
    if(todo){
      return res.send({todo});
    }
    res.status(404).send();
  }).catch((err)=>res.status(400).send());
});

app.delete('/todos/:todo_id',authenticate, (req,res)=>{
  let id = req.params.todo_id
  if(!ObjectID.isValid(id)){
    res.status(404).send();
  }
  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((todo)=>{
    if(todo){
      return res.send({todo});
    }
    res.status(404).send();
  }).catch((err)=>res.status(400).send());
});

app.patch('/todos/:todo_id', authenticate, (req,res)=>{
  let id = req.params.todo_id;
  if(!ObjectID.isValid(id)){
    res.status(404).send();
  }
  let newTodo = {
    completedAt: req.body.status === "completed" ? new Date() : null
  }
  if(req.body.text){
    newTodo.text = req.body.text;
  }
  if(req.body.status){
    newTodo.status = req.body.status;
  }
  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  },{$set: newTodo}, {new: true}).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }
    
    res.send({todo});
  }).catch((err)=>res.status(400).send());
});

app.post('/users', (req,res)=>{
  let body = _.pick(req.body, ['username','email', 'password']);
  let user = new User(body);

  user.save().then(()=>{
    return user.generateAuthToken();
  }).then((token)=>{
    res.header('x-auth',token).send(user);
  }).catch((err)=>{
    res.status(400).send(err);
  })
});

app.get('/users/me', authenticate, (req,res)=>{
  res.send(req.user);
});

app.post('/users/login', (req,res)=>{
  let body = _.pick(req.body, ['username', `email`, `password`]);
  User.findByCredentials(body.email, body.username, body.password).then((user)=>{
    return user.generateAuthToken().then((token)=>{
      res.header('x-auth',token).send(user);
    });
  }).catch((err)=>{
    res.status(400).send();
  });
});

app.delete('/users/me/token',authenticate, (req,res)=>{
  req.user.removeToken(req.token).then(()=>{
    res.status(200).send();
  },()=>{
    res.status(400).send();
  });
});

app.listen(port, ()=>{
  console.log(`Started listening at port ${port}`);
});

module.exports = {app};