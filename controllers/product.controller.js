import Product from "../model/product.model.js";

// @desc    Get all available food items (For Customers)
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isAvailable: true });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new food item (For Admin - Mr. Chuks)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    
    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: "Error creating product. Check your data." });
  }
};