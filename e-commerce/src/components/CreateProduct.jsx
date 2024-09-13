import React, { useState } from 'react';
import axios from 'axios';
import { uploadImage } from '../firebase'; // Asegúrate de que el path sea correcto
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Typography, Grid, Container } from '@mui/material';
import { styled } from '@mui/system';

const categories = [
    'Electrónica', 'Ropa', 'Hogar', 'Deportes', 'Juguetes', 'Muebles', 'Herramientas', 'Belleza', 'Salud', 'Automóviles',
    'Libros', 'Música', 'Videojuegos', 'Cocina', 'Jardinería', 'Accesorios para mascotas', 'Computadoras', 'Telefonía',
    'Fotografía', 'Oficina', 'Moda femenina', 'Moda masculina', 'Calzado', 'Relojes', 'Joyería', 'Artículos de viaje',
    'Artículos para bebés', 'Deportes al aire libre', 'Camping', 'Pesca', 'Bicicletas', 'Yoga y meditación', 'Manualidades',
    'Decoración', 'Arte', 'Instrumentos musicales', 'Productos ecológicos', 'Material de oficina', 'Productos para el hogar inteligente',
    'Accesorios para automóviles', 'Artículos de playa', 'Ropa deportiva', 'Ropa de cama', 'Artículos de cocina', 'Productos de limpieza',
    'Productos para el cuidado del cabello', 'Productos para la piel', 'Productos para el cuidado personal', 'Productos para el fitness',
    'Productos para mascotas'
];

const StyledContainer = styled(Container)({
    padding: '2rem',
});

const StyledFormControl = styled(FormControl)({
    width: '100%',
    marginBottom: '1rem',
});

const CreateProduct = () => {
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        status: '',
    });
    const [photos, setPhotos] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setPhotos(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Subir imágenes a Firebase y obtener URLs
        const imageUrls = [];
        try {
            for (const photo of photos) {
                const url = await uploadImage(photo);
                imageUrls.push(url);
            }

            // Crear un objeto con los datos del producto y las URLs de las imágenes
            const productWithImages = { ...productData, photos: imageUrls };

            // Enviar datos al backend
            const token = localStorage.getItem('token'); // El token JWT almacenado
            const response = await axios.post(
                'http://localhost:5000/api/seller/products',
                productWithImages,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json', // Cambia a 'application/json' ya que las imágenes ya están en Firebase
                    },
                }
            );
            setSuccess('Producto creado con éxito');
            setError('');
        } catch (error) {
            setError('Error creando el producto');
            setSuccess('');
            console.error('Error:', error);
        }
    };

    return (
        <StyledContainer>
            <Typography variant="h4" gutterBottom>Crear Producto</Typography>
            <form onSubmit={handleSubmit}>
                <StyledFormControl>
                    <TextField
                        label="Nombre"
                        name="name"
                        value={productData.name}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                </StyledFormControl>
                <StyledFormControl>
                    <TextField
                        label="Precio"
                        name="price"
                        type="number"
                        value={productData.price}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                </StyledFormControl>
                <StyledFormControl>
                    <InputLabel>Categoría</InputLabel>
                    <Select
                        name="category"
                        value={productData.category}
                        onChange={handleChange}
                        fullWidth
                        required
                    >
                        {categories.map((category, index) => (
                            <MenuItem key={index} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </Select>
                </StyledFormControl>
                <StyledFormControl>
                    <TextField
                        label="Stock"
                        name="stock"
                        type="number"
                        value={productData.stock}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                </StyledFormControl>
                <StyledFormControl>
                    <InputLabel>Estado</InputLabel>
                    <Select
                        name="status"
                        value={productData.status}
                        onChange={handleChange}
                        fullWidth
                        required
                    >
                        <MenuItem value="nuevo">Nuevo</MenuItem>
                        <MenuItem value="reacondicionado">Reacondicionado</MenuItem>
                        <MenuItem value="usado">Usado</MenuItem>
                    </Select>
                </StyledFormControl>

                <StyledFormControl>
                    <TextField
                        label="Descripción"
                        name="description"
                        value={productData.description}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        fullWidth
                        required
                    />
                </StyledFormControl>
                <StyledFormControl>
                    <input
                        type="file"
                        name="photos"
                        multiple
                        onChange={handleFileChange}
                        style={{ display: 'block' }}
                    />
                </StyledFormControl>
                <Button type="submit" variant="contained" color="primary">Crear Producto</Button>
            </form>
            {error && <Typography color="error">{error}</Typography>}
            {success && <Typography color="success">{success}</Typography>}
        </StyledContainer>
    );
};

export default CreateProduct;
