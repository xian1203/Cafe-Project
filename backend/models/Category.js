const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

// Check if model already exists to prevent recompilation
module.exports = mongoose.models.Category || mongoose.model('Category', categorySchema); 