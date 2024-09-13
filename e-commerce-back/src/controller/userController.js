
const User = require('../models/user');
const Product = require('../models/Product'); // Asegúrate de tener un modelo de producto

// Añadir producto al carrito
const addToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        // Verificar si el producto existe
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Buscar el usuario y actualizar el carrito
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verificar si el producto ya está en el carrito
        const existingItem = user.cart.find(item => item.productId.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            user.cart.push({ productId, quantity });
        }

        await user.save();
        res.status(200).json(user.cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar producto del carrito
const removeFromCart = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        // Buscar el usuario y actualizar el carrito
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Filtrar el carrito para eliminar el producto
        user.cart = user.cart.filter(item => item.productId.toString() !== productId);
        await user.save();
        res.status(200).json(user.cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar la cantidad de un producto en el carrito
const updateCartQuantity = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        // Buscar el usuario y actualizar el carrito
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Actualizar la cantidad del producto en el carrito
        const item = user.cart.find(item => item.productId.toString() === productId);
        if (item) {
            item.quantity = quantity;
            await user.save();
            res.status(200).json(user.cart);
        } else {
            res.status(404).json({ message: 'Item not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addToCart, removeFromCart, updateCartQuantity };
