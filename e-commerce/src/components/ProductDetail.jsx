import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, CircularProgress, Box, Grid, Card, CardContent, TextField, Button } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import StarRatingsComponent from './StarRatings'; // Asegúrate de tener la ruta correcta para el componente StarRatings
import { Rating } from '@mui/material'; // Para los "likes"
import { v4 as uuidv4 } from 'uuid';
// Importar tu contexto de carrito si lo tienes
import { CartContext } from '../components/CartContext'; // Suponiendo que ya tengas un contexto de carrito

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState(0);
    
    // Usar el contexto de carrito (si lo tienes)
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/public-products/${id}`);
                setProduct(response.data.product);
                setRating(response.data.product.rating || 0);
                setLikes(response.data.product.likes || 0);
                setComments(response.data.product.comments || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product:', error.response ? error.response.data : error.message);
                setError(error.response ? error.response.data : 'Error al obtener el producto');
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleRatingChange = async (newRating) => {
        setRating(newRating);
        try {
            await axios.patch(`http://localhost:5000/api/public-products/${id}/rating`, { rating: newRating });
        } catch (error) {
            console.error('Error updating rating:', error.message);
        }
    };

    const handleLike = async () => {
        try {
            await axios.patch(`http://localhost:5000/api/public-products/${id}/like`);
            setLikes(likes + 1);
        } catch (error) {
            console.error('Error updating like:', error.message);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const newComment = {
            id: uuidv4(),
            text: comment,
            date: new Date().toISOString()
        };

        try {
            await axios.post(`http://localhost:5000/api/public-products/${id}/comments`, newComment);
            setComments([...comments, newComment]);
            setComment('');
        } catch (error) {
            console.error('Error submitting comment:', error.message);
        }
    };

    const handleAddToCart = () => {
        if (product) {
            addToCart(product); // Suponiendo que tienes esta función en tu contexto de carrito
            alert('Producto añadido al carrito');
        }
    };

    const uniquePhotos = product?.photos && Array.isArray(product.photos) ? Array.from(new Set(product.photos)) : [];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <Container style={{ marginTop: '20px', marginBottom: '40px' }}>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography variant="body1" color="error">{error}</Typography>
            ) : product ? (
                <Card style={{ display: 'flex', padding: '20px', margin: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '12px' }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            {uniquePhotos.length > 1 ? (
                                <Slider {...settings}>
                                    {uniquePhotos.map((photo, index) => (
                                        <div key={index}>
                                            <img
                                                src={photo}
                                                alt={`Product Image ${index + 1}`}
                                                style={{
                                                    width: '100%',
                                                    height: 'auto',
                                                    borderRadius: '12px',
                                                    objectFit: 'cover',
                                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                                                }}
                                            />
                                        </div>
                                    ))}
                                </Slider>
                            ) : (
                                <img
                                    src={uniquePhotos[0] || '/default-image.jpg'}
                                    alt="Product Image"
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        borderRadius: '12px',
                                        objectFit: 'cover',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                            )}
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <CardContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                                <Box style={{ textAlign: 'center' }}>
                                    <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold' }}>
                                        {product.name || 'Producto sin nombre'}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary" paragraph>
                                        {product.description || 'No hay descripción disponible'}
                                    </Typography>
                                    <Typography variant="h5" color="primary" gutterBottom>
                                        ${product.price ? product.price.toFixed(2) : '0.00'}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" paragraph>
                                        Estado: {product.status || 'Desconocido'}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" paragraph>
                                        Categoría: {product.category || 'Sin categoría'}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Stock: {product.stock || 'Sin stock disponible'}
                                    </Typography>
                                    <Box marginTop={2}>
                                        <StarRatingsComponent
                                            rating={rating}
                                            changeRating={handleRatingChange}
                                        />
                                    </Box>
                                    <Box marginTop={2} display="flex" justifyContent="space-around">
                                        <Button variant="contained" color="primary" onClick={handleLike}>
                                            Like {likes}
                                        </Button>
                                        <Button variant="contained" color="secondary" onClick={handleAddToCart}>
                                            Add to Cart
                                        </Button>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Grid>
                    </Grid>

                    <Box marginTop={4}>
                        <Typography variant="h6" gutterBottom>
                            Comentarios
                        </Typography>
                        <form onSubmit={handleCommentSubmit}>
                            <TextField
                                label="Escribe un comentario"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={4}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <Button type="submit" variant="contained" color="primary" style={{ marginTop: '10px' }}>
                                Enviar
                            </Button>
                        </form>
                        <Box marginTop={2}>
                            {comments.length > 0 ? (
                                comments.map((comment) => (
                                    <Card key={comment.id} style={{ marginBottom: '10px', padding: '10px' }}>
                                        <Typography variant="body2" color="textSecondary">
                                            {comment.text}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {new Date(comment.date).toLocaleDateString()}
                                        </Typography>
                                    </Card>
                                ))
                            ) : (
                                <Typography variant="body2" color="textSecondary">
                                    No hay comentarios todavía.
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Card>
            ) : (
                <Typography variant="body1">Producto no encontrado.</Typography>
            )}
        </Container>
    );
};

export default ProductDetail;
