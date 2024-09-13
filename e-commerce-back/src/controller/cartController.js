// controllers/cartController.js
const CartItem = require('../models/Cart');

// Obtener productos en el carrito
exports.getCartItems = async (req, res) => {
  try {
    const cartItems = await CartItem.find({ userId: req.user._id });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cart items' });
  }
};

// Añadir un producto al carrito
exports.addToCart = async (req, res) => {
  const { productId, name, price, description } = req.body;

  try {
    // Verificar si el producto ya está en el carrito
    let cartItem = await CartItem.findOne({ productId: productId, userId: req.user._id });

    if (cartItem) {
      // Si ya está en el carrito, actualizar la cantidad
      cartItem.quantity += 1;
      await cartItem.save();
    } else {
      // Si no está en el carrito, crear uno nuevo
      cartItem = new CartItem({
        productId,
        name,
        price,
        description,
        userId: req.user._id
      });
      await cartItem.save();
    }

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: 'Error adding item to cart' });
  }
};

// Eliminar un producto del carrito
exports.removeFromCart = async (req, res) => {
  try {
    const cartItem = await CartItem.findOneAndDelete({
      _id: req.params.productId,
      userId: req.user._id
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: 'Error removing item from cart' });
  }
};
