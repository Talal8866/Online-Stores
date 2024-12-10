const User = require('../models/user.model');
const Product = require('../models/product.model');

// Wishlist Product
exports.wishlistProduct = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const user = await User.findById(userId);

    const productIndex = user.wishlist.indexOf(productId);
    if (productIndex === -1) {
      user.wishlist.push(productId);
      await user.save();
      return res.status(200).json({ message: 'Product added to wishlist successfully' });
    } else {
      user.wishlist.splice(productIndex, 1);
      await user.save();
      return res.status(200).json({ message: 'Product removed from wishlist successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating wishlist' });
  }
};


// Get Wish List
exports.getWishlist = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('wishlist');
    res.status(200).json(user.wishlist);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching wishlist' });
  }
};
