
const express = require('express');
const { addToCart, removeFromCart, updateCartQuantity } = require('../controllers/userController');

const router = express.Router();

router.post('/cart/add', addToCart);
router.post('/cart/remove', removeFromCart);
router.post('/cart/update', updateCartQuantity);

module.exports = router;
