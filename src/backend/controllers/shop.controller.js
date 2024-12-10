const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Shop = require('../models/shop.model');
const Product = require('../models/product.model');

// Registration
exports.registerShop = async (req, res) => {
  const {
    name,
    email,
    password,
    confirmPassword,
    address,
    phoneNumber,
    shopCategory,
    description,
    socialMediaLinks,
    owners,
  } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const existingShop = await Shop.findOne({ email });
    if (existingShop) {
      return res.status(400).json({ error: 'Email is already registered!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const logo = req.file ? req.file.path : null; // Get logo path from the uploaded file

    const shop = new Shop({
      name,
      email,
      password: hashedPassword,
      address,
      phoneNumber,
      shopCategory,
      description,
      socialMediaLinks: socialMediaLinks || [],
      logo,
      owners,
    });

    await shop.save();

    const tokenPayload = { id: shop._id, type: 'shop', version: shop.tokenVersion };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ token, message: 'Shop registered successfully' });
  } catch (error) {
    console.error('Error registering shop:', error);
    res.status(500).json({ error: 'Error registering shop' });
  }
};

// Login
exports.loginShop = async (req, res) => {
  const { email, password } = req.body;

  try {
    const shop = await Shop.findOne({ email });
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    const isMatch = await bcrypt.compare(password, shop.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const tokenPayload = { id: shop._id, type: 'shop', version: shop.tokenVersion };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ token, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
};

// Logout
exports.logoutShop = async (req, res) => {
try {
    await Shop.findByIdAndUpdate(req.user.id, { $inc: { tokenVersion: 1 } });
    res.status(200).json({ message: 'Logged shop out successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Logout failed' });
  }
};

// Get All Shops
exports.getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find();
    res.status(200).json(shops);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching shops' });
  }
};

// Rate Shop
exports.rateShop = async (req, res) => {
  const { shopId, rating } = req.body;

  if (rating < 0 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 0 and 5' });
  }

  try {
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    shop.ratings.push(rating);
    shop.calculateAverageRating();
    await shop.save();

    res.status(200).json({ message: 'Shop rated successfully', averageRating: shop.averageRating });
  } catch (error) {
    res.status(500).json({ error: 'Error rating shop' });
  }
};

// Get Public Shop Profile
exports.getPublicProfile = async (req, res) => {
  const { shopId } = req.params;

  try {
    const shop = await Shop.findById(shopId);
    console.log(shop);

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    const shopProducts = await Product.find({'linkedShop': shop._id});

    const shopProfile = {
      name: shop.name,
      rating: shop.averageRating,
      description: shop.description,
      category: shop.shopCategory,
      phoneNumber: shop.phoneNumber,
      email: shop.email,
      owners: shop.owners,
      products: shopProducts,
      logo: shop.logo,
    };

    res.status(200).json(shopProfile);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching shop profile' });
  }
};

// Get Current Shop Profile
exports.getShopProfile = async (req, res) => {
  const shopId = req.user.id;

  try {
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    const shopProducts = await Product.find({'linkedShop': shop._id});

    const shopProfile = {
      id: shop._id,
      name: shop.name,
      email: shop.email,
      address: shop.address,
      phoneNumber: shop.phoneNumber,
      category: shop.shopCategory,
      description: shop.description,
      socialMediaLinks: shop.socialMediaLinks,
      logo: shop.logo,
      rating: shop.averageRating,
      owners: shop.owners,
      products: shopProducts,
    };

    res.status(200).json(shopProfile);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching shop profile' });
  }
};

// Update shop profile
exports.updateProfile = async (req, res) => {
  const shopId = req.user.id;
  const updates = req.body;

  const allowedUpdates = [
    'name',
    'email',
    'address',
    'phoneNumber',
    'shopCategory',
  ];

  const isValidOperation = Object.keys(updates).every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates!' });
  }

  const requiredFields = allowedUpdates;
  const missingRequiredFields = requiredFields.filter((field) => !updates[field]);

  if (missingRequiredFields.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missingRequiredFields.join(', ')}` });
  }

  try {
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    Object.keys(updates).forEach((key) => {
      shop[key] = updates[key];
    });

    await shop.save();

    res.status(200).json({ message: 'Profile updated successfully', shop });
  } catch (error) {
    console.error('Error updating shop profile:', error);
    res.status(500).json({ error: 'Error updating profile' });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const shopId = req.user.id;

  try {
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, shop.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New password and confirm password do not match' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long' });
    }

    const salt = await bcrypt.genSalt(10);
    shop.password = await bcrypt.hash(newPassword, salt);

    await shop.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error changing password' });
  }
};

// Upload logo
exports.uploadLogo = async (req, res) => {
  const shopId = req.user.id;

  try {
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    shop.logo = `/uploads/${req.file.filename}`;
    await shop.save();

    res.status(200).json({ message: 'Logo uploaded successfully', logo: shop.logo });
  } catch (error) {
    console.error('Error uploading logo:', error);
    res.status(500).json({ error: 'Error uploading logo' });
  }
};

// Update shop description
exports.updateDescription = async (req, res) => {
  const shopId = req.user.id;
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  try {
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    shop.description = description;

    await shop.save();

    res.status(200).json({ message: 'Description updated successfully', shop });
  } catch (error) {
    console.error('Error updating shop description:', error);
    res.status(500).json({ error: 'Error updating description' });
  }
};

// Featured Shops List
exports.getFeaturedShops = async (req, res) => {
  try {
    const count = await Shop.countDocuments();
    if (count === 0) {
      return res.status(404).json({ message: 'No featured shops found' });
    }

    const randomShops = await Shop.aggregate([
      { $sample: { size: 8 } }
    ]);

    return res.status(200).json({ shops: randomShops });
  } catch (error) {
    console.error('Error fetching featured shops:', error);
    return res.status(500).json({ error: 'Error fetching featured shops' });
  }
};

// Get Shops By Category
exports.getShopsByCategory = async (req, res) => {
const category = req.params.category.toLowerCase();

  try {
    const shops = await Shop.find({ 'shopCategory': category });

    if (shops.length === 0) {
      return res.status(404).json({ message: 'No shops found in this category' });
    }

    return res.status(200).json({ shops });
  } catch (error) {
    console.error('Error fetching shops by category:', error);
    return res.status(500).json({ error: 'Error fetching shops' });
  }
};
