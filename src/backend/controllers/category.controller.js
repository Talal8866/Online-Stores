const Category = require('../models/category.model');
const Product = require('../models/product.model');

// Fetch all global categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching categories' });
  }
};

exports.getFeaturedCategories = async (req, res) => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      return res.status(404).json({ message: 'No featured categories found' });
    }

    const featuredCategories = await Category.aggregate([{ $sample: { size: 12 } }]);

    const categoriesWithProducts = await Promise.all(featuredCategories.map(async (category) => {
      const randomProduct = await Product.aggregate([
        { $match: { category: category.name } },
        { $sample: { size: 1 } }
      ]);

      const productPicture = randomProduct.length > 0 ? randomProduct[0].picture : null;

      return {
        categoryName: category.name,
        productPicture,
      };
    }));

    res.status(200).json({ categories: categoriesWithProducts });
  } catch (error) {
    console.error('Error retrieving featured categories:', error);
    res.status(500).json({ error: 'Error retrieving featured categories' });
  }
};
