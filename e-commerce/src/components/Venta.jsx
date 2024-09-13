// Venta.jsx
import React, { useState } from 'react';

const Venta = () => {
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState('');
    const [photos, setPhotos] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/seller/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ productName, price, description, category, stock, photos })
            });

            if (response.ok) {
                const data = await response.json();
                alert('Producto publicado con éxito');
            } else {
                const error = await response.json();
                alert('Error al publicar el producto: ' + error.message);
            }
        } catch (error) {
            alert('Error en la solicitud: ' + error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Product Name:
                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} />
            </label>
            <label>
                Price:
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </label>
            <label>
                Description:
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>
            <label>
                Category:
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
            </label>
            <label>
                Stock:
                <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
            </label>
            <label>
                Photos (comma-separated URLs):
                <input type="text" value={photos} onChange={(e) => setPhotos(e.target.value.split(','))} />
            </label>
            <button type="submit">Sell</button>
        </form>
    );
};

export default Venta;
