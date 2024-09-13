const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Controlador para registrar un usuario
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validaciones básicas
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear un nuevo usuario (ejemplo sin persistencia real)
        const user = {
            id: Date.now(),
            name,
            email,
            password: hashedPassword,
        };
s
        res.status(201).json({ message: 'Usuario registrado', token });
    } catch (error) {
        res.status(500).json({ message: 'Error registrando al usuario' });
    }
};

// Controlador para iniciar sesión
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ajusta la ruta según tu estructura de proyecto

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validaciones básicas
        if (!email || !password) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Buscar el usuario por su correo electrónico
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Credenciales incorrectas' });
        }

        // Comparar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales incorrectas' });
        }

        // Generar un token JWT
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '24h',
        });

        res.json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};


module.exports = {
    registerUser,
    loginUser,
};
