const mongoose = require("mongoose");
const nodemon = require("nodemon");
const { Schema } = mongoose;

const NoteSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: String,
});

module.exports = mongoose.model("note", NoteSchema);
