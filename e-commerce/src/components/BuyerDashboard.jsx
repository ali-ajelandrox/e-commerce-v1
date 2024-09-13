import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BuyerDashboard = () => {
    const [purchases, setPurchases] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchPurchases = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await fetch('http://localhost:5000/api/buyer/purchases', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setPurchases(data.purchases);
        } catch (error) {
            setError(error.message);
            console.error('Error fetching purchases:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPurchases();
    }, []);

    return (
        <div>
            <h1>Buyer Dashboard</h1>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {!loading && purchases.length === 0 && (
                <p>Aún no has hecho ninguna compra. ¡Haz tu primera compra!</p>
            )}
            {!loading && purchases.length > 0 && (
                <ul>
                    {purchases.map(purchase => (
                        <li key={purchase._id}>
                            Product: {purchase.product.name}, Quantity: {purchase.quantity}, Date: {new Date(purchase.date).toLocaleDateString()}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default BuyerDashboard;
