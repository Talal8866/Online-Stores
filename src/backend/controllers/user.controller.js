const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

//Registration
exports.registerUser = async (req, res) => {
  const {
    name,
    email,
    password,
    confirmPassword,
    address,
    phoneNumber,
  } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      address,
      phoneNumber,
    });

    await user.save();

  const tokenPayload = { id: user._id, type: 'user', version: user.tokenVersion };

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ token, message: 'User registered and logged in successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
};

// Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

  const tokenPayload = { id: user._id, type: 'user', version: user.tokenVersion };

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ token, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
};

// Logout
exports.logoutUser = async (req, res) => {
try {
    await User.findByIdAndUpdate(req.user.id, { $inc: { tokenVersion: 1 } });
    res.status(200).json({ message: 'Logged user out successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Logout failed' });
  }
};

// Get Public Profile
exports.getPublicProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('wishlist');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userProfile = {
      name: user.name,
      email: user.email,
      address: user.address,
      wishlist: user.wishlist,
    };

    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user profile' });
  }
};

// Get Current User Profile
exports.getUserProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user profile' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  const updates = req.body;

  const allowedUpdates = [
    'name',
    'email',
    'address',
    'phoneNumber',
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
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    Object.keys(updates).forEach((key) => {
      user[key] = updates[key];
    });

    await user.save();

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Error updating profile' });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
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
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error changing password' });
  }
};
