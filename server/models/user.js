const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

let UserSchema = new mongoose.Schema({
  username: {
    required: true,
    type: String,
    minlength: 3,
    trim: true
  }, email: {
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    type: String,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} not a valid email'
    }
  }, password: {
    required: true,
    type: String,
    minlength: 8,
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.toJSON = function(){
  let user = this;
  let userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email', 'username']);
};

UserSchema.methods.generateAuthToken = function(){
  let user = this;
  let access = 'auth';
  let token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

  user.tokens = user.tokens.concat([{access,token}]);

  return user.save().then(()=>{
    return token;
  });
};

UserSchema.statics.findByToken = function(token){
  let User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  }
  catch (e){
    return Promise.reject();
  }
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
}

UserSchema.statics.findByCredentials = function(email, username, password){
  let User = this;

  return User.findOne({email,username}).then((user)=>{
    if(!user){
      return Promise.reject();
    }

    return new Promise((resolve,reject)=>{
      bcrypt.compare(password, user.password, (err,res)=>{
        if(res){
          resolve(user);
        } else {
          reject();
        }
      });
    });
  })
}

UserSchema.pre('save', function(next){
  let user = this;

  if(user.isModified('password')){
    bcrypt.genSalt(10, (err,salt)=>{
      bcrypt.hash(user.password, salt, (err,hash)=>{
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

UserSchema.methods.removeToken = function(token){
  let user = this;
  return user.update({
    $pull: {
      tokens: {
        token
      }
    }
  });
};

let User = mongoose.model('Users', UserSchema);

module.exports = {User}