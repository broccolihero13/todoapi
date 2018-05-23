const { MongoClient, ObjectID } = require('mongodb');

// Destructuring
// let user = {name: 'Aurora', age: '21'};
// let {name} = user;
// console.log(name);

let obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/toDoApp', (err,client)=>{
  if(err){
    return console.log(`Unable to connect to database. Received error: ${err}`);
  }
  console.log(`Successfully connected to MongoDB`);
  
  const db = client.db('toDoApp');

  // db.collection('Todos').insertOne({text: "Check off Trello box", status: "completed"},(err,result)=>{
  //   if(err){
  //     return console.log(`Unable to add to the Todos collection. Received error: ${err}`);
  //   }
  //   console.log(JSON.stringify(result.ops,undefined,2));
  // });

  //Create to set an id
  // db.collection('Users').insertOne({_id: "1234567", name: "Casey Rowley", age: 28, location: "Paradise City"},(err,result)=>{
  //   if(err){
  //     return console.log("somethingwentwrong");
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });
  
  // //Get the time stamp at creation of record
  // db.collection('Users').insertOne({name: "Rose Halladay", age: 29, location: "Took the Midnight traing going anywhere"},(err,result)=>{
  //   if(err){
  //     return console.log("somethingwentwrong");
  //   }
  //   console.log(result.ops[0]._id.getTimestamp());
  // });

  client.close();
});