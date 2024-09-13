const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./src/models/Product');
const authRoutes = require('./src/routes/authRoutes');
const purchaseRoutes = require('./src/routes/purchaseRoutes');
const sellerRoutes = require('./src/routes/sellerRoutes');
const userRoutes = require('./src/routes/userRoutes');
const productRoutes = require('./src/routes/productRoutes');
const authenticateToken = require('./src/middleware/authenticateToken');
const cartRoutes = require('./src/routes/cartRoutes');
const { getPublicProducts } = require('./src/controller/productController');
const path = require('path');

require('dotenv').config();

const app = express();

// Configuración de CORS
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conectar a MongoDB
mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch(error => console.error('Error de conexión a MongoDB:', error));

// Usar las rutas
app.use('/api',productRoutes)
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes); // Rutas de productos (públicas si no estás autenticado)
app.use('/api/buyer', purchaseRoutes); 
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);
 // Rutas para compras


// Rutas de vendedor protegidas con autenticación
app.use('/api/seller/products', authenticateToken, productRoutes);
app.use('/api/seller', authenticateToken, sellerRoutes); // Asume que también requieres autenticación aquí

// Rutas de vendedor protegidas con autenticación
app.use('/api/seller/products', authenticateToken, productRoutes);
app.use('/api/seller', authenticateToken, sellerRoutes); // Asume que también requieres autenticación aquí


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
