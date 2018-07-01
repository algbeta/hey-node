const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    name: String,
    required: [true, 'User name is required!']
  },
  login: {
    name: String,
    required: [true, 'Login is required!']
  },
  password: { type: String, required: [true, 'Password is required!'] }
});

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;
