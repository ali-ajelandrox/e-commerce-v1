const express = require('express');
const Purchase = require('../models/Purchase'); // Asegúrate de que la ruta al modelo sea correcta
const router = express.Router();

// Obtener todas las compras de un comprador
router.get('/purchases', async (req, res) => {
    try {
        const userId = req.userId; // Obtén el ID del usuario autenticado desde el token
        const purchases = await Purchase.find({ userId }).populate('productId');
        res.json({ purchases });
    } catch (error) {
        console.error('Error fetching purchases:', error);
        res.status(500).json({ error: 'Error fetching purchases' });
    }
});



// Obtener todas las compras del vendedor autenticado
exports.getPurchases = async (req, res) => {
    try {
        const userId = req.user._id; // Obtén el ID del usuario autenticado
        const purchases = await Purchase.find({ seller: userId }).populate('product');
        res.json({ purchases });
    } catch (error) {
        console.error('Error fetching purchases:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = router;
