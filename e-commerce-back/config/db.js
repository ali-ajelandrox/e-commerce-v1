const mongoose = require('mongoose');
require('dotenv').config(); // Cargar variables del archivo .env

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Detiene la aplicación si la conexión falla
    }
};

module.exports = connectDB;
