const Product = require('../models/Product');
const fs = require('fs');
const path = require('path')
const { deleteImageFromFirebase } = require('../../config/firebase');

// Crear un nuevo producto
const createProduct = async (req, res) => {
    try {
        const product = new Product({
            ...req.body,
            createdBy: req.user.id // Asume que `req.user` está definido por el middleware authenticateToken
        });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error creating product' });
    }
};

// Obtener todos los productos del vendedor autenticado
const getSellerProducts = async (req, res) => {
    try {
        const products = await Product.find({ createdBy: req.user.userId });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo productos', error: error.message });
    }
};

// Obtener un producto específico por ID

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
            stock: req.body.stock
        };

        // Actualizar las URLs de las fotos en el producto
        if (req.files && req.files.length > 0) {
            const photos = await Promise.all(req.files.map(file => uploadImage(file)));
            updateFields.photos = photos;
          }
       else if (req.body.photos) {
            // Si no hay archivos pero hay URLs en el cuerpo de la solicitud
            updateFields.photos = req.body.photos;
        }

        // Eliminar imágenes que ya no están en la base de datos
        const photosToDelete = product.photos.filter(photo => !updateFields.photos.includes(photo));
        for (const photo of photosToDelete) {
            await deleteImageFromFirebase(photo);
        }

        const updatedProduct = await Product.findByIdAndUpdate(productId, updateFields, { new: true });

        res.json({ message: 'Producto actualizado con éxito', product: updatedProduct });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ message: 'Error al actualizar el producto' });
    }
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.productId);
        if (!deletedProduct) return res.status(404).json({ message: 'Producto no encontrado' });
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error eliminando el producto', error: error.message });
    }
};

// controller/productController.js
const getPublicProducts = async (req, res) => {
    try {
        const products = await Product.find(); // O ajusta la consulta según tus necesidades
        res.status(200).json({ products });
    } catch (error) {
        console.error('Error obteniendo productos públicos:', error);
        res.status(500).json({ message: 'Error obteniendo productos públicos', error: error.message });
    }
};


const getPublicProductsById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }
        res.json({ product });
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener el producto' });
    }
}


const getPublicProductsByCategory = async (req, res) => {
    try {
        const { category } = req.query; // Obtener la categoría desde los parámetros de consulta
        if (!category) {
            return res.status(400).json({ message: 'Category is required' });
        }
        const products = await Product.find({ category: category }); // Buscar productos por categoría
        res.json({ products });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving products by category' });
    }
};



module.exports = {
    getPublicProductsByCategory,
    createProduct,
    getSellerProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getPublicProducts,
    getPublicProductsById
};
