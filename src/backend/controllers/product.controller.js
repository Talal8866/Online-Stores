const Product = require('../models/product.model');
const Shop = require('../models/shop.model');
const User = require('../models/user.model');

exports.addOrUpdateProduct = async (req, res) => {
  const { id, name, price, description, category, availability } = req.body;
  const linkedShop = req.user.id;
  const picture = req.file ? req.file.path : null;

  if (!name || !price || !description || !category) {
    return res.status(400).json({ error: 'Please provide all required fields: name, price, description, category.' });
  }

  try {
    if (id) {
      const existingProduct = await Product.findById(id);
      if (existingProduct) {
        existingProduct.name = name || existingProduct.name;
        existingProduct.price = price !== undefined ? price : existingProduct.price;
        existingProduct.description = description || existingProduct.description;
        existingProduct.linkedShop = linkedShop;
        existingProduct.picture = picture || existingProduct.picture;
        existingProduct.category = category || existingProduct.category;
        existingProduct.availability = availability !== undefined ? availability : existingProduct.availability;

        await existingProduct.save();
        return res.status(200).json({ message: 'Product updated successfully', product: existingProduct });
      } else {
        return res.status(404).json({ error: 'Product not found' });
      }
    } else {
      const newProduct = new Product({
        name,
        price,
        description,
        linkedShop,
        picture,
        category,
        availability,
      });

      await newProduct.save();
      return res.status(201).json({ message: 'Product added successfully', product: newProduct });
    }
  } catch (error) {
    console.error('Error adding/updating product:', error);
    res.status(500).json({ error: 'Error adding/updating product' });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting product' });
  }
};

// Get Product Details
exports.getProductDetails = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user && req.user.type === 'user' ? req.user.id : null;

  try {
    const product = await Product.findById(productId).populate('linkedShop');

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let isWishlisted = false;
    if (userId) {
      const user = await User.findById(userId);
      isWishlisted = user.wishlist.includes(productId);
    }

    const productDetails = {
      name: product.name,
      price: product.price,
      description: product.description,
      linkedShop: product.linkedShop,
      picture: product.picture,
      category: product.category,
      availability: product.availability,
      isWishlisted,
    };

    res.status(200).json(productDetails);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching product details' });
  }
};

// Get Products By Category
exports.getProductsByCategory = async (req, res) => {
  const category = req.params.category.toLowerCase();

  try {
    const products = await Product.find({ category });

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found for this category' });
    }

    return res.status(200).json({ products });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return res.status(500).json({ error: 'Error fetching products' });
  }
};

// Featured Products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const count = await Product.countDocuments({ availability: true });
    if (count === 0) {
      return res.status(404).json({ message: 'No featured products found' });
    }

    const randomProducts = await Product.aggregate([
      { $match: { availability: true } },
      { $sample: { size: 10 } }
    ]);

    return res.status(200).json({ products: randomProducts });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return res.status(500).json({ error: 'Error fetching featured products' });
  }
};

// All Products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }

    return res.status(200).json({ products: products });
  } catch (error) {
    console.error('Error fetching products list:', error);
    return res.status(500).json({ error: 'Error fetching products list:' });
  }
};
