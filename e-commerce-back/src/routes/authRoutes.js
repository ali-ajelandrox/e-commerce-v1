const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Cargar las variables de entorno
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

// Registro de Usuario
router.post('/register', async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        role,
        companyName,
        industry,
        country,
        commonInterest,
    } = req.body;

    // Verificar si las contraseñas coinciden
    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Verificar si el email ya está registrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: 'Email is already in use' });
    }

    try {
        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear un nuevo usuario
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
            companyName: role === 'seller' ? companyName : undefined,
            industry: role === 'seller' ? industry : undefined,
            country: role === 'seller' ? country : undefined,
            commonInterest: role === 'buyer' ? commonInterest : undefined,
        });

        // Guardar el usuario en la base de datos
        await user.save();

        res.status(201).json({ message: 'User registered successfully', userId: user._id });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Error registering user' });
    }
});

// Login de Usuario
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id, role: user.role }, jwtSecret, { expiresIn: '5h' });
        res.json({ token, role: user.role, userId: user._id });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Error logging in' });
    }
});

module.exports = router;
