const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  isbn: { type: String, required: true, unique: true, trim: true },
  genre: { type: String, trim: true },
  totalCopies: { type: Number, default: 1, min: 1 },
  availableCopies: { type: Number, default: 1, min: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
