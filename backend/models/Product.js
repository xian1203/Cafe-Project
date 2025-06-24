const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  rating: { type: Number, default: 5 },
  discount: { type: Number, default: 0 }
});

// Check if model already exists to prevent recompilation
module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
