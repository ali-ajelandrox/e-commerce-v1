const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');

// Configuración de la conexión a MongoDB
const url = 'mongodb://localhost:27017';
const dbName = 'my-ecommerce-db';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

const categories = [
  'Electronics', 'Fashion', 'Home', 'Sports', 'Toys', 'Books', 'Beauty', 'Automotive', 'Grocery', 'Jewelry', 'Music', 'Health', 'Garden', 'Tools', 'Pet Supplies'
];

// Función para generar URL de imágenes aleatorias
const generateImageUrl = () => {
  const randomNum = faker.number.int({ min: 1, max: 1000 }); // Genera un número aleatorio
  return `https://picsum.photos/seed/${randomNum}/200/200`; // URL de imagen aleatoria
};

const generateProduct = (category) => {
  return {
    publication_id: uuidv4(), // Generar UUID usando el módulo uuid
    name: faker.commerce.productName(), // Usa faker para generar nombres de productos
    description: faker.commerce.productDescription(), // Usa faker para descripciones
    price: parseFloat(faker.commerce.price()), // Usa faker para precios y convierte a número
    category,
    stock: faker.number.int({ min: 0, max: 1000 }), // Usa faker.number.int en lugar de datatype.number
    status: faker.helpers.arrayElement(['nuevo', 'reacondicionado', 'usado']),
    photos: [
      generateImageUrl(), 
      generateImageUrl()
    ],
    createdBy: faker.number.int({ min: 1, max: 10 }), // Usa faker.number.int en lugar de datatype.number
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Insertar productos en MongoDB
const insertProducts = async () => {
  try {
    await client.connect();
    console.log('Connected to database');

    const db = client.db(dbName);
    const collection = db.collection('products');

    const products = [];

    categories.forEach(category => {
      for (let i = 0; i < 4; i++) {
        products.push(generateProduct(category));
      }
    });

    await collection.insertMany(products);
    console.log('Inserted 50 products');
  } finally {
    await client.close();
  }
};

insertProducts().catch(console.error);
