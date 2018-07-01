const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'User name is required!'],
    trim: true
  },
  login: {
    type: String,
    required: [true, 'Login is required!'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required!']
  }
});

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;
