const express = require('express');
const router = express.Router();
const Buyer = require('../models/user'); // Asegúrate de tener el modelo correcto
const Purchase = require('../models/Purchase'); // Asegúrate de que el modelo de Purchase esté correctamente importado
const Product = require('../models/Product'); // Asegúrate de tener el modelo de Product
const authenticateToken = require('../middleware/authenticateToken');

// Obtener datos del comprador por ID
router.get('/:id', async (req, res) => {
    try {
        const buyer = await Buyer.findById(req.params.id);
        if (!buyer) return res.status(404).json({ error: 'Buyer not found' });
        res.json(buyer);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching buyer data', details: error.message });
    }
});

// Obtener las compras del comprador
router.get('/purchases', authenticateToken, async (req, res) => {
    const userId = req.user.userId;

    try {
        const purchases = await Purchase.find({ buyer: userId }).populate('product');
        if (!purchases.length) return res.status(404).json({ error: 'No purchases found' });
        res.json({ purchases });
    } catch (error) {
        console.error('Error fetching purchases:', error.message);
        res.status(500).json({ error: 'Error fetching purchases', details: error.message });
    }
});

// Crear una compra
router.post('/purchases', authenticateToken, async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.userId;

    // Validar que quantity es un número positivo
    if (quantity <= 0 || isNaN(quantity)) {
        return res.status(400).json({ error: 'Invalid quantity' });
    }

    try {
        // Verificar que el producto exista
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        // Crear una nueva compra
        const purchase = new Purchase({
            buyer: userId,
            product: productId,
            quantity,
            date: new Date()
        });

        await purchase.save();
        res.status(201).json({ message: 'Purchase successful', purchase });
    } catch (error) {
        console.error('Error creating purchase:', error.message);
        res.status(500).json({ error: 'Error creating purchase', details: error.message });
    }
});

module.exports = router;
