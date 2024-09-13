import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Crear el contexto
export const CartContext = createContext();

// Proveedor del contexto
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        // Intentar obtener el carrito del localStorage si existe
        const storedCart = localStorage.getItem('cart');
        return storedCart ? JSON.parse(storedCart) : [];
    });

    // Efecto para guardar el carrito en localStorage cuando cambie
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Efecto para cargar los productos del carrito desde la API
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/cart', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setCartItems(response.data);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchCartItems();
    }, []);

    // Función para añadir un producto al carrito
    const addToCart = (product) => {
        setCartItems((prevItems) => {
            // Comprobar si el producto ya está en el carrito
            const itemExists = prevItems.find((item) => item.productId === product.productId);

            if (itemExists) {
                // Si ya está en el carrito, actualizar la cantidad
                return prevItems.map((item) =>
                    item.productId === product.productId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // Si no está en el carrito, añadirlo
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
    };

    // Función para eliminar un producto del carrito
    const removeFromCart = (productId) => {
        setCartItems((prevItems) =>
            prevItems.filter((item) => item.productId !== productId)
        );
    };

    // Función para actualizar la cantidad de un producto en el carrito
    const updateCartItemQuantity = (productId, quantity) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.productId === productId ? { ...item, quantity: quantity } : item
            )
        );
    };

    // Función para calcular el total del carrito
    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateCartItemQuantity,
                calculateTotal
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

// Hook personalizado para usar el contexto del carrito
export const useCart = () => useContext(CartContext);
