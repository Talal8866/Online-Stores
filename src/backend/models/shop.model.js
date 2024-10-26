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
<<<<<<< HEAD
=======
    trim: true,
    lowercase: true,
>>>>>>> 56e7f94a71e014bfeef9900f95ee05e017ff0687
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
    enum: ['OPTION1', 'OPTION2', 'OPTION3'],
    required: true,
  },
  description: {
    type: String,
    required: true,
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
<<<<<<< HEAD
    type: [String],
=======
    type: String,
>>>>>>> 56e7f94a71e014bfeef9900f95ee05e017ff0687
    required: true,
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

const Shop = mongoose.model('Shop', shopSchema);
module.exports = Shop;
