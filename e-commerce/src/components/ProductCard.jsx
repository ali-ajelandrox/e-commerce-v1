import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, CircularProgress, Box, Grid, Card, CardContent, Button } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ProductDetail = () => {
    const { id } = useParams(); // Obtén el ID del producto de la URL
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Usamos la ruta pública para obtener el producto
                const response = await axios.get(`http://localhost:5000/api/public-products/${id}`);
                setProduct(response.data.product);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product:', error.response ? error.response.data : error.message);
                setError(error.response ? error.response.data : 'Error al obtener el producto');
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // Configuración del carrusel
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <Container>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography variant="body1">{error}</Typography>
            ) : product ? (
                <Card style={{ display: 'flex', padding: '20px', margin: '20px' }}>
                    <Grid container spacing={2}>
                        {/* Carrusel de imágenes del producto */}
                        <Grid item xs={12} md={5}>
                            <Slider {...settings}>
                                {product.photos && product.photos.length > 0 ? (
                                    product.photos.map((photo, index) => (
                                        <div key={index}>
                                            <img
                                                src={photo}
                                                alt={`Product Image ${index + 1}`}
                                                style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <img
                                        src="/default-image.jpg"
                                        alt="Default Product Image"
                                        style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                                    />
                                )}
                            </Slider>
                        </Grid>

                        {/* Detalles del producto a la derecha */}
                        <Grid item xs={12} md={7}>
                            <CardContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                                {/* Información del producto */}
                                <Box>
                                    <Typography variant="h4" gutterBottom>{product.name || 'Producto sin nombre'}</Typography>
                                    <Typography variant="body1" color="textSecondary" paragraph>{product.description || 'No hay descripción disponible'}</Typography>
                                    <Typography variant="h5" color="primary">${product.price ? product.price.toFixed(2) : '0.00'}</Typography>
                                    <Typography variant="body2" color="textSecondary" paragraph>Estado: {product.status || 'Desconocido'}</Typography>
                                    <Typography variant="body2" color="textSecondary">Categoría: {product.category || 'Sin categoría'}</Typography>
                                    <Typography variant="body2" color="textSecondary">Stock: {product.stock || 'Sin stock disponible'}</Typography>
                                </Box>
                            </CardContent>
                        </Grid>
                    </Grid>
                </Card>
            ) : (
                <Typography variant="body1">Producto no encontrado.</Typography>
            )}
        </Container>
    );
};

export default ProductDetail;
