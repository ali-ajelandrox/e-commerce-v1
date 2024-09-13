import React, { useState } from 'react';

const Compra = () => {
    const [productId, setProductId] = useState('');
    const [quantity, setQuantity] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/buyer/purchases', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ productId, quantity })
            });

            if (response.ok) {
                const data = await response.json();
                alert('Compra realizada con éxito');
            } else {
                const error = await response.json();
                alert('Error al realizar la compra: ' + error.message);
            }
        } catch (error) {
            alert('Error en la solicitud: ' + error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Product ID:
                <input type="text" value={productId} onChange={(e) => setProductId(e.target.value)} />
            </label>
            <label>
                Quantity:
                <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </label>
            <button type="submit">Buy</button>
        </form>
    );
};

export default Compra;