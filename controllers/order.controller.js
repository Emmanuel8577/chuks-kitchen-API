import Order from "../model/order.model.js";
import Product from "../model/product.model.js";

/**
 * CUSTOMER LOGIC
 */

// Place a new order
export const placeOrder = async (req, res) => {
  const { items, deliveryAddress } = req.body;

  try {
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let total = 0;
    const processedItems = [];

    // Edge Case: Validate availability & price for every item
    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product || !product.isAvailable) {
        return res.status(400).json({ 
          message: `Validation Failed: ${product?.name || "An item"} is currently unavailable.` 
        });
      }

      // We calculate total on the backend to prevent "price tampering" from frontend
      total += product.price * item.quantity;

      // Lock the price at the moment of purchase
      processedItems.push({
        product: item.product,
        quantity: item.quantity,
        priceAtTimeOfOrder: product.price
      });
    }

    const order = await Order.create({
      customer: req.user._id, // Set by protectRoute middleware
      items: processedItems,
      totalPrice: total,
      deliveryAddress,
    });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Customer tracking their own orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort("-createdAt");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ADMIN LOGIC (Mr. Chuks & Team)
 */

// GET all orders for Admin dashboard
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email")
      .sort("-createdAt");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE order status (The Lifecycle Management)
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params; 
  const { status } = req.body; 

  const validStatuses = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Completed", "Cancelled"];

  try {
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status update" });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true } 
    ).populate("customer", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ 
      message: `Order is now: ${status}`, 
      order 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};