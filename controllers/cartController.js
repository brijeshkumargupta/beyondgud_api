const Cart = require('../models/Cart');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, cartItems: [] });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        cartItems: [{ product: productId, qty }],
      });
    } else {
      const itemIndex = cart.cartItems.findIndex(p => p.product.toString() === productId);

      if (itemIndex > -1) {
        let productItem = cart.cartItems[itemIndex];
        productItem.qty += qty;
        cart.cartItems[itemIndex] = productItem;
      } else {
        cart.cartItems.push({ product: productId, qty });
      }
    }

    cart = await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCart, addToCart };
