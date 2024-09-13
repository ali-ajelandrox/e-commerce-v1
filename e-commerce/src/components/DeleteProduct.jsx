import React from 'react';
import { Button, Container } from '@mui/material';
import { useParams } from 'react-router-dom';

function DeleteProduct() {
    const { id } = useParams();

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/products/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                console.log('Producto eliminado con éxito');
                // Aquí puedes redirigir o actualizar la lista de productos
            } else {
                console.error('Error al eliminar el producto');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Container>
            <Button variant="contained" color="secondary" onClick={handleDelete}>
                Eliminar Producto
            </Button>
        </Container>
    );
}

export default DeleteProduct;
