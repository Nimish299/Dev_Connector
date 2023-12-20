const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String, // Assuming you'll store a URL or path to the user's avatar
  },
  date: {
    type: Date, // Assuming you want to store a date
    default: Date.now, // Set the default value to the current date and time
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
