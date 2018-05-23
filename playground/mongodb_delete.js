const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/toDoApp', (err,client)=>{
  if(err){
    return console.log(`Unable to connect to database. Received error: ${err}`);
  }
  console.log(`Successfully connected to MongoDB`);
  
  //deleteMany
  // const db = client.db('toDoApp');
  // db.collection('Todos').deleteMany({text: 'Have fun'}).then((result)=>{
  //   console.log(result);
  // }).catch((err)=>{
  //   console.log(err);
  // })
  //deleteOne
  // const db = client.db('toDoApp');
  // db.collection('Todos').deleteOne({text: 'have fun'}).then((result)=>{
  //   console.log(result);
  // }).catch((err)=>{
  //   console.log(err);
  // });
  //findOneAndDelete - returns the deleted object.
  // const db = client.db('toDoApp');
  // db.collection('Todos').findOneAndDelete({status: 'completed'}).then((result)=>{
  //   console.log(result);
  // }).catch((err)=>{
  //   console.log(err);
  // });

  // client.close();
});