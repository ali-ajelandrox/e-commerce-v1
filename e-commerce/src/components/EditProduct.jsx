import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, TextField, Grid, Input } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { uploadImage, deleteImageFromFirebase } from '../firebase';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function EditProduct() {
    const { productId } = useParams(); // Obtenemos el ID del producto desde la URL
    const navigate = useNavigate(); // Para redirigir después de actualizar
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        photos: [] // Array de fotos
    });
    const [imagePreviews, setImagePreviews] = useState([]); // Previsualización de imágenes
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (productId) {
            const fetchProduct = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const data = await response.json();
                    setFormData({
                        name: data.product.name,
                        description: data.product.description,
                        price: data.product.price,
                        category: data.product.category,
                        stock: data.product.stock,
                        photos: data.product.photos || []
                    });
                    setImagePreviews(data.product.photos);
                } catch (error) {
                    console.error('Error fetching product:', error);
                }
            };
            fetchProduct();
        }
    }, [productId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        // Verificar que el número total de imágenes no exceda el límite
        if (formData.photos.length + files.length > 10) {
            alert('Puedes subir un máximo de 10 imágenes.');
            return;
        }

        const newFiles = files.slice(0, 10 - formData.photos.length); // Tomar solo las que faltan

        setFormData({
            ...formData,
            photos: [...formData.photos, ...newFiles]
        });

        const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
        setImagePreviews([...imagePreviews, ...newPreviews]);
    };

    const handleRemoveImage = async (url) => {
        try {
            const filePath = url.split('/o/')[1]?.split('?')[0]?.replace(/%2F/g, '/').replace(/%20/g, ' ');

            if (!filePath) {
                throw new Error('No se pudo extraer el path del archivo de la URL');
            }

            // Eliminar imagen de Firebase
            await deleteImageFromFirebase(filePath);

            const updatedPhotos = formData.photos.filter(photo => photo !== url);
            setFormData({
                ...formData,
                photos: updatedPhotos
            });

            const updatedPreviews = imagePreviews.filter(preview => preview !== url);
            setImagePreviews(updatedPreviews);

        } catch (error) {
            console.error('Error removing image:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Obtener las URLs de las imágenes nuevas
        const newPhotoUrls = await Promise.all(
            formData.photos.filter(file => typeof file !== 'string').map(async (file) => {
                const url = await uploadImage(file);
                return url;
            })
        );

        // Filtrar las URLs existentes y agregar nuevas URLs
        const updatedPhotoUrls = [
            ...formData.photos.filter(photo => typeof photo === 'string'),
            ...newPhotoUrls
        ];

        const data = {
            name: formData.name,
            description: formData.description,
            price: formData.price,
            category: formData.category,
            stock: formData.stock,
            photos: updatedPhotoUrls
        };

        try {
            const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Producto actualizado con éxito', result);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
        }

        setLoading(false);
    };

    return (
        <Container>
            <Typography variant="h3" gutterBottom>
                Editar Producto
            </Typography>

            <Box sx={modalStyle}>
                <Typography id="modal-title" variant="h6" component="h2">
                    Editar Producto
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2} marginTop={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Nombre del Producto"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Descripción"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                fullWidth
                                required
                                multiline
                                rows={4}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Precio"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                fullWidth
                                required
                                type="number"
                                InputProps={{ inputProps: { min: 0 } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Categoría"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Stock"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                fullWidth
                                required
                                type="number"
                                InputProps={{ inputProps: { min: 0 } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Input
                                type="file"
                                inputProps={{ multiple: true }}
                                onChange={handleFileChange}
                                fullWidth
                                accept="image/*"
                            />
                            {imagePreviews.length > 0 ? (
                                <Box mt={2}>
                                    {imagePreviews.map((preview, index) => (
                                        <Box key={index} sx={{ display: 'inline-block', position: 'relative', marginRight: '8px' }}>
                                            <img
                                                src={preview}
                                                alt={`preview-${index}`}
                                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                            />
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleRemoveImage(preview)}
                                                sx={{ position: 'absolute', top: 0, right: 0 }}
                                            >
                                                X
                                            </Button>
                                        </Box>
                                    ))}
                                </Box>
                            ) : (
                                <Typography>No hay imágenes</Typography>
                            )}
                        </Grid>
                        <Grid item xs={12} textAlign="right">
                            <Button variant="contained" color="primary" type="submit" disabled={loading}>
                                {loading ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Container>
    );
}

export default EditProduct;
