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
    _id: new ObjectID(),
    status: "in progress"
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
  it('should return a 404 for non-object ids', (done)=>{
    request(app)
    .get(`/todos/abcdefg`)
    .expect(404)
    .end(done);
  });
});

describe('DELETE /todos/:id', ()=>{
  it('should remove todo', (done)=>{
    let idToDelete = todos[1]._id.toHexString();
    request(app)
    .delete(`/todos/${idToDelete}`)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo._id).toBe(idToDelete);
    })
    .end((err,res)=>{
      if(err){
        return done(err);
      }
      Todo.findById(idToDelete).then((todo)=>{
        expect(todo).toBeFalsy();
        done();
      }).catch((err)=>done(err))
    });
  });
  it('should return a 404 if todo is not found', (done)=>{
    let randID = new ObjectID();
    request(app)
    .delete(`/todos/${randID.toHexString()}`)
    .expect(404)
    .end(done);
  });

  it('should return a 404 if the ObjectID is invalid', (done)=>{
    let notAnId = "nothing";
    request(app)
    .delete(`/todos/${notAnId}`)
    .expect(404)
    .end(done);
  });
});

describe('PATCH /todos/:todo_id', ()=>{
  it('should update the todo', (done)=>{
    let idToUpdate = todos[0]._id.toHexString();
    let text = "newText";
    let status = "completed";
    request(app)
    .patch(`/todos/${idToUpdate}`)
    .send({text,status})
    .expect(200)
    .end((err,res)=>{
      if(err){
        return done(err);
      }
      Todo.findById(idToUpdate).then((todo)=>{
        expect(todo.text).toBe(text);
        expect(todo.status).toBe(status);
        expect(todo.completedAt).toBeTruthy();
        done();
      }).catch((err)=>done(err))
    });
  });
  it('should clear completedAt if status != completed', (done)=>{
    let idToUpdate = todos[1]._id.toHexString();
    let text = "otherNewText";
    let status = "open";
    request(app)
    .patch(`/todos/${idToUpdate}`)
    .send({text,status})
    .expect(200)
    .end((err,res)=>{
      if(err){
        return done(err);
      }
      Todo.findById(idToUpdate).then((todo)=>{
        expect(todo.text).toBe(text);
        expect(todo.status).toBe(status);
        expect(todo.completedAt).toBeFalsy();
        done();
      }).catch((err)=>done(err))
    });
  });
})