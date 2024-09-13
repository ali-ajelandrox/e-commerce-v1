const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1 // Asegura que la cantidad sea al menos 1
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0 // Asegura que el precio total no sea negativo
    },
    saleDate: {
        type: Date,
        default: Date.now // Fecha de la venta
    }
}, {
    timestamps: true // Agrega campos createdAt y updatedAt
});

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;
