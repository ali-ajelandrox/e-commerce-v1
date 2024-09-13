// backend/controller/sellerController.js
const mongoose = require('mongoose'); 
const Product = require('../models/Product');
const User = require('../models/User');
const fs = require('fs');
const path = require('path')
const { v4: uuidv4 } = require('uuid');

// Ruta para crear un producto
// controllers/productController.js
const createProduct = async (req, res) => {
  const { name, description, price, category, stock, status, photos } = req.body; // Asegúrate de que `photos` esté incluido

  console.log('Datos recibidos:', { name, description, price, category, stock, status, photos });
  console.log('Usuario autenticado (req.user):', req.user);

  try {
      if (!name || !description || !price || !category || !stock || !status) {
          return res.status(400).json({ message: 'Todos los campos son requeridos' });
      }

      const userId = req.user.userId;

      const product = new Product({
          publication_id: uuidv4(),
          name,
          description,
          price,
          category,
          stock,
          status,
          photos, // Aquí se deben guardar las URLs recibidas
          createdBy: userId, // Se usa el userId del token decodificado
      });

      await product.save();
      res.status(201).json({ message: 'Producto creado con éxito', product });
  } catch (error) {
      console.error('Error creando producto:', error);
      res.status(500).json({ message: 'Error creando producto', error: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const { userId } = req.user;
    if (!userId) {
        return res.status(400).json({ message: 'ID de usuario no proporcionado' });
    }

    // Buscar productos por userId
    const products = await Product.find({ createdBy: userId });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};








// Obtener un producto por ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error });
  }
};

// Actualizar un producto por ID
async function updateProduct(req, res) {
  try {
      const productId = req.params.productId;

      // Buscar el producto
      const product = await Product.findById(productId);
      if (!product) {
          return res.status(404).json({ message: 'Producto no encontrado' });
      }

      // Actualizar los campos del producto
      const updateFields = {
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          category: req.body.category,
          stock: req.body.stock,
          photos: req.body.photos // Guardar URLs de imágenes en MongoDB
      };

      const updatedProduct = await Product.findByIdAndUpdate(productId, updateFields, { new: true });

      res.json({ message: 'Producto actualizado con éxito', product: updatedProduct });
  } catch (error) {
      console.error('Error al actualizar el producto:', error);
      res.status(500).json({ message: 'Error al actualizar el producto' });
  }
}




// Función para eliminar un producto
const deleteProduct = async (req, res) => {
  const { productId } = req.params; // Cambio a `productId`
  try {
    const deletedProduct = await Product.findByIdAndDelete(productId); // Cambio a `productId`
    if (!deletedProduct) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtener datos del vendedor
const getSellerData = async (req, res) => {
  try {
    const seller = await User.findById(req.params.id);
    if (!seller) return res.status(404).json({ message: 'Vendedor no encontrado' });
    res.status(200).json(seller);
  } catch (error) {
    console.error('Error obteniendo datos del vendedor:', error);
    res.status(500).json({ message: 'Error obteniendo datos del vendedor' });
  }
};

// Obtener ventas
const getSales = async (req, res) => {
  try {
    // Implementar lógica para obtener ventas
    res.status(200).json([]);
  } catch (error) {
    console.error('Error obteniendo ventas:', error);
    res.status(500).json({ message: 'Error obteniendo ventas' });
  }
};

// Obtener compras
const getPurchases = async (req, res) => {
  try {
    // Implementar lógica para obtener compras
    res.status(200).json([]);
  } catch (error) {
    console.error('Error obteniendo compras:', error);
    res.status(500).json({ message: 'Error obteniendo compras' });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getSellerData,
  getSales,
  getPurchases
};