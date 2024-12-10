const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

// Add a product to the cart
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const cart = await Cart.findOneAndUpdate(
      { userId },
      {
        $setOnInsert: { userId },
        $inc: { 'products.$[elem].quantity': quantity },
        $set: {
          'products.$[elem].name': product.name,
          'products.$[elem].category': product.category,
          'products.$[elem].picture': product.picture,
          'products.$[elem].price': product.price,
        },
      },
      {
        new: true,
        upsert: true,
        arrayFilters: [{ 'elem.productId': productId }],
      }
    );

    res.status(200).json({ message: 'Product added or updated in cart successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Error adding product to cart.' });
  }
};

// View the cart
exports.viewCart = async (req, res) => {
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ userId }).populate({
      path: 'products.productId',
      populate: { path: 'linkedShop', select: 'name' } // Populate linkedShop with only the name field
    });

    if (!cart) {
      cart = new Cart({ userId, products: [] });
      await cart.save();
    }

    const totalPrice = cart.products.reduce((total, item) => {
      return total + item.productId.price * item.quantity;
    }, 0);

    const populatedProducts = cart.products.map(item => ({
      productId: item.productId._id,
      quantity: item.quantity,
      name: item.productId.name,
      category: item.productId.category,
      picture: item.productId.pictures && item.productId.pictures.length > 0 ? item.productId.pictures[0] : null,
      price: item.productId.price,
      shopName: item.productId.linkedShop ? item.productId.linkedShop.name : null, // Access the shop name
    }));

    res.status(200).json({ products: populatedProducts, totalPrice });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cart.' });
  }
};

// Update product quantity in the cart
exports.updateCartQuantity = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found.' });
    }

    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found in cart.' });
    }

    cart.products[productIndex].quantity = quantity;
    await cart.save();

    res.status(200).json({ message: 'Quantity updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating quantity.' });
  }
};

// Remove a product from the cart
exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found.' });
    }

    cart.products = cart.products.filter(p => p.productId.toString() !== productId);
    await cart.save();

    res.status(200).json({ message: 'Product removed from cart successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Error removing product from cart.' });
  }
};

// Clear User's Cart (Checkout)
exports.clearCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

for (const item of cart.products) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
      }

      if (!product.availability) {
        return res.status(400).json({
          message: `Product ${product.name} is out of stock`
        });
      }
    }

    cart.products = [];
    await cart.save();

    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
