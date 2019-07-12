const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  text: String,
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Model = mongoose.model('Todo', TodoSchema);

module.exports = Model;
