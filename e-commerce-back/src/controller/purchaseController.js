const Product = require('../models/Product');
const User = require('../models/User');
const { uploadImageToFirebase } = require('../config/firebaseConfig');
const path = require('path');
const fs = require('fs');
const Busboy = require('busboy');

// Función para crear un producto
const createProduct = async (productData) => {
  try {
    // Validar los datos del producto si es necesario
    if (!productData.name || !productData.price) {
      throw new Error('El nombre y el precio son obligatorios');
    }

    const product = new Product(productData);
    const savedProduct = await product.save();
    return { product: savedProduct };
  } catch (err) {
    console.error('Error al crear el producto:', err);
    throw new Error(`Error al crear el producto: ${err.message}`);
  }
};

// Función para obtener todos los productos de un vendedor
const getProducts = async (userId) => {
  try {
    const products = await Product.find({ createdBy: userId }).select('-__v');
    return products;
  } catch (err) {
    console.error('Error al obtener productos:', err);
    throw new Error(`Error al obtener productos: ${err.message}`);
  }
};

// Función para obtener un producto por ID
const getProductById = async (id) => {
  try {
    const product = await Product.findById(id).select('-__v');
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return product;
  } catch (err) {
    console.error('Error al obtener el producto:', err);
    throw new Error(`Error al obtener el producto: ${err.message}`);
  }
};

// Función para actualizar un producto
const updateProduct = async (id, productData) => {
  try {
    // Validar los datos del producto si es necesario
    if (!productData.name || !productData.price) {
      throw new Error('El nombre y el precio son obligatorios');
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true }).select('-__v');
    if (!updatedProduct) {
      throw new Error('Producto no encontrado para actualizar');
    }
    return { product: updatedProduct };
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    throw new Error(`Error al actualizar el producto: ${error.message}`);
  }
};

// Función para manejar la creación de productos con archivos
const handleProductCreation = async (req, res) => {
  const busboy = Busboy({ headers: req.headers });
  const uploadDir = path.join(__dirname, '../uploads');
  const userId = req.user.id; // Asegúrate de que el usuario esté autenticado
  
  let productData = {
    name: '',
    price: 0,
    status: '',
    category: '',
    stock: 0,
    description: '',
    photos: [],
    createdBy: userId // Establecer el ID del creador del producto
  };

  busboy.on('field', (fieldname, value) => {
    productData[fieldname] = value;
  });

  busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
    if (fieldname === 'photos') {
      const filePath = path.join(uploadDir, filename);
      file.pipe(fs.createWriteStream(filePath));

      file.on('end', async () => {
        try {
          const url = await uploadImageToFirebase(filePath);
          productData.photos.push(url);
          await fs.promises.unlink(filePath);
        } catch (err) {
          console.error('Error al subir la imagen:', err.message);
        }
      });
    }
  });

  busboy.on('finish', async () => {
    try {
      const result = await createProduct(productData);
      res.status(201).json({ msg: 'Producto creado con éxito', product: result.product });
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      res.status(500).json({ msg: 'Error al procesar la solicitud', error: error.message });
    }
  });

  req.pipe(busboy);
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  handleProductCreation
};
