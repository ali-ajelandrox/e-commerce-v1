import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Grid, Card, CardContent } from '@mui/material';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/public-products');
                setCategories(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return <Typography variant="h6" align="center" color="textSecondary">Loading...</Typography>;
    }

    if (error) {
        return <Typography variant="h6" align="center" color="error">Error fetching categories: {error.message}</Typography>;
    }

    if (!categories || categories.length === 0) {
        return <Typography variant="h6" align="center" color="textSecondary">No categories available</Typography>;
    }

    return (
        <Grid container spacing={2}>
            {categories.map((category) => (
                <Grid item xs={12} sm={6} md={4} key={category._id}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">{category.name}</Typography>
                            {/* Agrega más detalles sobre la categoría aquí si es necesario */}
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default CategoriesPage;
