import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, Typography, Button, IconButton, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { CartContext } from './CartContext'; // Asegúrate de que esta ruta sea correcta
import '../styles/Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, calculateTotal } = useContext(CartContext);

  // Cargar los productos del carrito cuando se monta el componente
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/cart', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        // Asumiendo que estás manejando el estado en CartContext, actualiza aquí si es necesario
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, []);

  const handleRemoveFromCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      removeFromCart(productId);
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handleCheckout = () => {
    alert('Proceeding to checkout...');
  };

  return (
    <div className="cart-container">
      <Typography variant="h4" gutterBottom>Shopping Cart</Typography>
      {cartItems.length === 0 ? (
        <Typography variant="h6">Your cart is empty</Typography>
      ) : (
        <Grid container spacing={2}>
          {cartItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body2" color="textSecondary">{item.description}</Typography>
                  <Typography variant="h6">${item.price.toFixed(2)}</Typography>
                  <IconButton color="secondary" onClick={() => handleRemoveFromCart(item._id)}>
                    <DeleteIcon />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {cartItems.length > 0 && (
        <Button variant="contained" color="primary" onClick={handleCheckout}>
          Checkout
        </Button>
      )}
    </div>
  );
};

export default Cart;
