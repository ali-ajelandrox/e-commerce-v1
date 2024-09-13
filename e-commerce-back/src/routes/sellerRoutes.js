const express = require('express'); 
const router = express.Router();
const authMiddleware = require('../middleware/authenticateToken');
const Product = require('../models/Product');
const uploadFiles = require('../middleware/uploadFiles');

const { 
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getSellerData,
    getSales,
    getPurchases 
} = require('../controller/sellerController');
const { upload } = require('../middleware/upload');


router.post('/products',upload.array('photos'), createProduct, authMiddleware);
// Middleware para autenticación
router.use(authMiddleware);

// Middleware para autorización: solo permite acceso a usuarios con rol 'seller'

// Rutas para productos

router.get('/products', getProducts);

router.get('/products/:productId', getProductById);
router.put('/products/:productId', updateProduct , uploadFiles);
router.delete('/products/:productId', deleteProduct)
// Otras rutas
router.get('/seller/:id', getSellerData);
router.get('/sales', getSales);
router.get('/purchases', getPurchases);

module.exports = router;
