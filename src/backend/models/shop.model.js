const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  shopCategory: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
  },
  socialMediaLinks: {
    type: [String],
  },
  logo: {
    type: String, // Store the logo URL or file path
  },
  ratings: {
    type: [Number],
    default: [],
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  owners: {
    type: String,
  },
  tokenVersion: {
    type: Number,
    default: 0,
  },
});

shopSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
  } else {
    const total = this.ratings.reduce((acc, rating) => acc + rating, 0);
    this.averageRating = (total / this.ratings.length).toFixed(1); // Round to one decimal place
  }
};

shopSchema.pre('save', function(next) {
  if (this.shopCategory) {
    this.shopCategory = this.shopCategory.toLowerCase();
  }
  next();
});

const Shop = mongoose.model('Shop', shopSchema);
module.exports = Shop;
