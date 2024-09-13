    // models/Product.js
    const mongoose = require('mongoose');
    const { v4: uuidv4 } = require('uuid');

    const productSchema = new mongoose.Schema({
        publication_id: { type: String, unique: true, required: true, default: uuidv4 },
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        category: { type: String, required: true },
        stock: { type: Number, required: true, min: 0 },
        status: { type: String, required: true, enum: ['nuevo', 'reacondicionado', 'usado'] },
        photos: [], // URLs de las fotos subidas
        createdBy: { type: Number, required: true }, // ID del usuario que crea el producto
    }, { timestamps: true });

    const Product = mongoose.model('Product', productSchema);
    module.exports = Product;
