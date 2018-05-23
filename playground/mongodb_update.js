const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,client)=>{
  if(err){
    return console.log(`Unable to connect to MongoDB server because ${err}`);
  }
  console.log('Connected to MongoDB server 27017');
  //findOneAndUpdate - returns original object by default - update will replace ALL items
  // const db = client.db('toDoApp');
  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('5af635848a53900b07e48dc8')
  // },{
  //   $set:{
  //     status: 'completed'
  //   }
  // },{
  //   returnOrignal: false
  // }).then((result)=>{
  //   console.log(result);
  // }).catch((err)=>{
  //   console.log(err);
  // });

  
  //users exercises:
  const db = client.db('toDoApp');
  db.collection('Users').findOneAndUpdate({
    name: "Thorn"
  }, {
    $inc:{
      age: 1
    }
  },{
    returnOriginal: false
  }).then((result)=>{
    console.log(result);
  }).catch((err)=>{
    console.log(err);
  });
  client.close();
});