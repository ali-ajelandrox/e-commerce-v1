// models/User.js
const mongoose = require('mongoose');
const Counter = require('./Counter'); // Importar el modelo del contador

const userSchema = new mongoose.Schema({
    _id: { type: Number }, // Este es el ID numérico del usuario
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['buyer', 'seller'],
        default: 'buyer',
    },
    companyName: { type: String },
    industry: { type: String },
    country: { type: String },
    commonInterest: { type: [String] },
}, { timestamps: true });

// Hook para asignar un ID secuencial
userSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'userId' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this._id = counter.seq;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
