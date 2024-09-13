import React, { useState, useEffect } from 'react';
import { Container, Button, Typography, Modal, Box, Paper, Grid } from '@mui/material';
import axios from 'axios';
import ProductList from './ProductList';
import CreateProduct from './CreateProduct';
import EditProduct from './EditProduct';
import DeleteProduct from './DeleteProduct';

function SellerDashboard() {
    const [products, setProducts] = useState([]);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [error, setError] = useState('');

    const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/seller/products', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProducts(response.data);
                console.log('Products fetched successfully:', response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Error al obtener productos');
            }
        };

        if (token) {
            fetchProducts();
        }
    }, [token]);

    const handleCreateProduct = async (newProduct) => {
        try {
            const formData = new FormData();
            Object.keys(newProduct).forEach(key => {
                formData.append(key, newProduct[key]);
            });

            const response = await axios.post('http://localhost:5000/api/seller/products', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });

            setProducts(prevProducts => [...prevProducts, response.data]);
            setOpenCreateModal(false);
        } catch (error) {
            console.error('Error creating product:', error);
            setError('Error al crear el producto');
        }
    };

    const handleEditProduct = async (updatedProduct) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/seller/products/${updatedProduct._id}`, updatedProduct, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setProducts(prevProducts => 
                prevProducts.map(product =>
                    product._id === response.data._id ? response.data : product
                )
            );
            setOpenEditModal(false);
            setSelectedProduct(null);
        } catch (error) {
            console.error('Error editing product:', error);
            setError('Error al editar el producto');
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await axios.delete(`http://localhost:5000/api/seller/products/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setProducts(prevProducts => 
                prevProducts.filter(product => product._id !== productId)
            );
            setOpenDeleteModal(false);
            setSelectedProduct(null);
        } catch (error) {
            console.error('Error deleting product:', error);
            setError('Error al eliminar el producto');
        }
    };

    return (
        <Container maxWidth="lg">
            <Paper elevation={3} style={{ padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <Typography variant="h4" gutterBottom style={{ fontWeight: 700, color: '#333' }}>
                    Seller Dashboard
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenCreateModal(true)}
                    style={{ marginBottom: '20px', backgroundColor: '#007bff', color: '#fff' }}
                >
                    Crear Nuevo Producto
                </Button>

                {error && <Typography color="error">{error}</Typography>}

                {products.length > 0 ? (
                    <ProductList 
                        products={products} 
                        isAuthenticated={!!token}
                        onEdit={(product) => {
                            setSelectedProduct(product);
                            setOpenEditModal(true);
                        }} 
                        onDelete={(product) => {
                            setSelectedProduct(product);
                            setOpenDeleteModal(true);
                        }} 
                    />
                ) : (
                    <Typography>No se encontraron productos</Typography>
                )}
            </Paper>

            {/* Modal para crear producto */}
            <Modal
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                aria-labelledby="create-product-modal"
                aria-describedby="create-product-description"
            >
                <Box sx={modalStyle}>
                    <CreateProduct onCreate={handleCreateProduct} onClose={() => setOpenCreateModal(false)} />
                </Box>
            </Modal>

            {/* Modal para editar producto */}
            <Modal
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
                aria-labelledby="edit-product-modal"
                aria-describedby="edit-product-description"
            >
                <Box sx={modalStyle}>
                    <Typography variant="h6" id="edit-product-modal" style={{ marginBottom: '20px' }}>Editar Producto</Typography>
                    {selectedProduct && (
                        <EditProduct
                            product={selectedProduct}
                            onUpdate={handleEditProduct}
                            onClose={() => {
                                setOpenEditModal(false);
                                setSelectedProduct(null);
                            }}
                        />
                    )}
                </Box>
            </Modal>

            {/* Modal para eliminar producto */}
            <Modal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                aria-labelledby="delete-product-modal"
                aria-describedby="delete-product-description"
            >
                <Box sx={modalStyle}>
                    <Typography variant="h6" id="delete-product-modal" style={{ marginBottom: '20px' }}>Eliminar Producto</Typography>
                    {selectedProduct && (
                        <DeleteProduct
                            product={selectedProduct}
                            onDelete={handleDeleteProduct}
                            onClose={() => {
                                setOpenDeleteModal(false);
                                setSelectedProduct(null);
                            }}
                        />
                    )}
                </Box>
            </Modal>
        </Container>
    );
}

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    maxWidth: '600px',
    bgcolor: 'background.paper',
    border: '1px solid #ddd',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
};

export default SellerDashboard;
