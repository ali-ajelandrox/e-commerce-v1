const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const Product = require('../models/Product');
const {
    getPublicProductsByCategory,
    getPublicProductsById,
    getSellerProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getPublicProducts
} = require('../controller/productController');

// Ruta para obtener todos los productos del vendedor autenticado (requiere autenticación)
router.get('/seller-products', authenticateToken, getSellerProducts);

// Ruta para obtener un producto específico por ID (requiere autenticación)
router.get('/products/:productId', authenticateToken, getProductById);

// Ruta para actualizar un producto (requiere autenticación)
router.put('/products/:productId', authenticateToken, updateProduct);

// Ruta para eliminar un producto (requiere autenticación)
router.delete('/products/:productId', authenticateToken, deleteProduct);

// Ruta para obtener todos los productos públicos (sin autenticación)
router.get('/public-products', getPublicProducts);

router.get('/public-products/:id', getPublicProductsById);

router.get('/public-products',getPublicProductsByCategory);

module.exports = router;
