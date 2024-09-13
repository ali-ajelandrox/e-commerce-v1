import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductList from '../components/ProductList';
import { Container, Typography } from '@mui/material'; // Importa algunos componentes de Material-UI para dar estilo

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/public-products');
                setProducts(response.data.products);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <Container style={{ padding: '20px' }}> {/* Contenedor con margen para darle espacio */}
            <Typography variant="h4" gutterBottom>
                Home Page
            </Typography>
            {loading ? (
                <Typography variant="body1">Loading...</Typography>
            ) : (
                <ProductList products={products} />
            )}
        </Container>
    );
};

export default HomePage;
