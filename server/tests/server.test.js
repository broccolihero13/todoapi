const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const todos = [
  {
    text: 'First test todo', 
    _id: new ObjectID()
  },
  {
    text: 'Second test todo',
    _id: new ObjectID()
  }];

beforeEach((done)=>{
  Todo.remove({}).then(()=>{
    return Todo.insertMany(todos);
  }).then(()=> done());
});

describe('POST /todos', ()=>{
  it('should create a new todo', (done)=>{
    let text = "abcdefg";

    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((res)=>{
      expect(res.body.text).toBe(text);
    })
    .end((err,res)=>{
      if(err){
        return done(err);
      }
      Todo.find({text}).then((allTodos)=>{
        expect(allTodos.length).toBe(1);
        expect(allTodos[0].text).toBe(text);
        done();
      }).catch((err)=>done(err))
    });
  });
  it('should not create a to do and return a bad data response', (done)=>{
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err,res)=>{
        if(err){
          return done(err);
        }
        Todo.find().then((allTodos)=>{
          expect(allTodos.length).toBe(2);
          done();
        }).catch((err)=>done(err))
      });
  });
});
describe('GET /todos', ()=>{
  it('should fetch all todos', (done)=>{
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res)=>{
        expect(res.body.todos.length).toBe(2)
      })
      .end((err,res)=>{
        if(err){
          return done(err);
        }
        Todo.find().then((allTodos)=>{
          expect(allTodos.length).toBe(2);
          done()
        }).catch((err)=>done(err));
      });
  });
});
describe('GET /todos/:id', ()=>{
  it('should return todo doc', (done)=>{
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res)=>{
      expect(todos[0].text).toBe(res.body.todo.text);
    })
    .end(done);
  });
  it('should return a 404 if todo is not found', (done)=>{
    let randID = new ObjectID();
    request(app)
    .get(`/todos/${randID.toHexString()}`)
    .expect(404)
    .end(done);
  });
  it('ashould return a 404 for non-object ids', (done)=>{
    request(app)
    .get(`/todos/abcdefg`)
    .expect(404)
    .end(done);
  })
});