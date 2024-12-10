const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
  },
  linkedShop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
  },
  picture: {
    type: String,
  },
  category: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  availability: {
    type: Boolean,
    default: true,
  },
});

productSchema.pre('save', function(next) {
  if (this.category) {
    this.category = this.category.toLowerCase();
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
