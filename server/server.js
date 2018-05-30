require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

let app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

app.post('/todos', (req,res)=>{
  let todo = new Todo({
    text: req.body.text,
    status: req.body.status,
    completedAt: req.body.status === "completed" ? new Date() : null
  });
  todo.save().then((doc)=>{
    res.send(doc);
  }).catch((err)=>{
    res.status(400).send(err);
  })
});

app.get('/todos', (req,res)=>{
  Todo.find().then((todos)=>{
    res.send({todos});
  }).catch((err)=>res.status(400).send(err));
})

app.get(`/todos/:todo_id`, (req,res)=>{
  if(!ObjectID.isValid(req.params.todo_id)){
    res.status(404).send();
  }
  Todo.findById(req.params.todo_id).then((todo)=>{
    if(todo){
      return res.send({todo});
    }
    res.status(404).send();
  }).catch((err)=>res.status(400).send());
});

app.delete('/todos/:todo_id', (req,res)=>{
  if(!ObjectID.isValid(req.params.todo_id)){
    res.status(404).send();
  }
  Todo.findByIdAndRemove(req.params.todo_id).then((todo)=>{
    if(todo){
      return res.send({todo});
    }
    res.status(404).send();
  }).catch((err)=>res.status(400).send());
});

app.patch('/todos/:todo_id', (req,res)=>{
  if(!ObjectID.isValid(req.params.todo_id)){
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
  Todo.findByIdAndUpdate(req.params.todo_id,{
    $set: newTodo
  }, {new: true}).then((todo)=>{
    res.send({todo});
  }).catch((err)=>res.status(400).send());
});

app.post('/users', (req,res)=>{
  let body = _.pick(req.body, ['email', 'password']);
  let user = new User(body);
  user.save().then((user_record)=>{
    res.send(user_record);
  }).catch((err)=>{
    res.status(400).send(err);
  })
});

app.listen(port, ()=>{
  console.log(`Started listening at port ${port}`);
});

module.exports = {app};