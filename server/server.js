const express = require('express');
const bodyParser = require('body-parser');

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

app.listen(port, ()=>{
  console.log(`Started listening at port ${port}`);
});

module.exports = {app};