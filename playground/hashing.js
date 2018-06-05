const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let password = '123abc!';

bcrypt.genSalt(10, (err,salt)=>{
  bcrypt.hash(password, salt, (err,hash)=>{
    console.log(hash);
  })
});

let hashedPassword = '$2a$10$GcNpGUTyPSEbLRcV8rhzUu5HkQRuAoXDqY5XFdmTEdyOA5hJInDjW';

bcrypt.compare(password, hashedPassword, (err, res)=>{
  console.log(res);
});
// let data = {
//   id: 4
// };

// let token = jwt.sign(data, 'somesecret');

// console.log(token);

// let decoded = jwt.verify(token, 'somesecret');

// console.log(decoded);
// // let message = "I am human";
// // let hash = SHA256(message).toString();

// // let hash2 = SHA256(hash).toString();

// // console.log(message, hash, hash2);

// // let data = {
// //   id: 4
// // };

// // let token = {
// //   data,
// //   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// // };

// // let resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();

// // if (resultHash === token.hash){
// //   console.log('Data was not changed');
// // } else {
// //   console.log('Data was changed. Do not trust!');
// // }