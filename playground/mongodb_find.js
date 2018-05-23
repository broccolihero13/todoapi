const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/toDoApp', (err,client)=>{
  if(err){
    return console.log(`Unable to connect to database. Received error: ${err}`);
  }
  console.log(`Successfully connected to MongoDB`);
  
  //query by object ID
  // const db = client.db('toDoApp');
  // db.collection('Todos').find({
  //   _id: new ObjectID('5af5deaa8a53900b07e48623')
  // }).toArray().then((docs)=>{
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs,undefined,2));
  // }).catch((err)=>{
  //   console.log(err);
  // });
  
  // //query count for a collection
  // const db = client.db('toDoApp');
  // db.collection('Todos').find().count().then((count)=>{
  //   console.log(`Todos Count: ${count}`);
  // }).catch((err)=>{
  //   console.log(err);
  // });

  const db = client.db('toDoApp');
  db.collection('Users').find({"name":"Brock Halladay"}).count().then((count)=>{
    console.log(`Users Count: ${count}`);
  }).catch((err)=>{
    console.log(err);
  });
  // client.close();
});