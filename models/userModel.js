const mongoose = require('mongoose');
const validator = require('validator');
//name,email,photo,password,passwordConfrim
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tells us your name!'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please provide your emails'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
