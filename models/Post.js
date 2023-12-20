const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId, // Corrected the typo "Scema" to "Schema"
    ref: 'Users',
  },
  text: {
    type: String, // Corrected the typo "string" to "String"
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String, // Assuming you'll store a URL or path to the user's avatar
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId, // Corrected the typo "Scema" to "Schema"
        ref: 'Users',
      },
    },
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId, // Corrected the typo "Scema" to "Schema"
        ref: 'Users',
      },
      text: {
        type: String, // Corrected the typo "string" to "String"
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      avatar: {
        type: String, // Assuming you'll store a URL or path to the user's avatar
      },
      date: {
        type: Date,
        default: Date.now, // Corrected the typo "deafult" to "default"
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now, // Corrected the typo "deafult" to "default"
  },
});

module.exports = mongoose.model('Post', PostSchema); // Use 'Post' for the model name
