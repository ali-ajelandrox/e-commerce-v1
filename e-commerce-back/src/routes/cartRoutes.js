const express = require('express');
const router = express.Router();
const cartController = require('../controller/cartController');
const authenticateToken  = require('../middleware/authenticateToken');

// Rutas del carrito
router.get('/', authenticateToken , cartController.getCartItems);
router.post('/', authenticateToken , cartController.addToCart);
router.delete('/:productId', authenticateToken , cartController.removeFromCart);

module.exports = router;
