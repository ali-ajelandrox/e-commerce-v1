const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1 // Asegura que la cantidad sea al menos 1
        },
        price: {
            type: Number,
            required: true,
            min: 0 // Asegura que el precio no sea negativo
        }
    }],
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0 // Asegura que el monto total no sea negativo
    },
    orderDate: {
        type: Date,
        default: Date.now // Fecha de la compra
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Cancelled'], // Estado de la orden
        default: 'Pending'
    }
}, {
    timestamps: true // Agrega campos createdAt y updatedAt
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
