// components/FilterPopup.js
import React from 'react';
import { Popover, Typography, FormControl, InputLabel, Select, MenuItem, Button, Grid, InputBase } from '@mui/material';
import { useFilters } from './FilterContext';
import { categoriesMap } from './categories'; // Importa el mapeo

const FilterPopup = ({ anchorEl, onClose }) => {
    const { selectedCategory, setSelectedCategory, minPrice, setMinPrice, maxPrice, setMaxPrice } = useFilters();

    const handleApplyFilters = () => {
        // Aquí puedes implementar la lógica para aplicar los filtros
        onClose(); // Cierra el popover después de aplicar los filtros
    };

    return (
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <div style={{ padding: '16px', minWidth: '300px' }}>
                <Typography variant="h6">Filtros</Typography>
                <FormControl fullWidth variant="outlined" style={{ marginTop: '16px' }}>
                    <InputLabel>Categoría</InputLabel>
                    <Select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        label="Categoría"
                    >
                        <MenuItem value="">Todas las categorías</MenuItem>
                        {Object.entries(categoriesMap).map(([english, spanish]) => (
                            <MenuItem key={english} value={english}>
                                {spanish}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Grid container spacing={2} style={{ marginTop: '16px' }}>
                    <Grid item xs={6}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Precio Mínimo</InputLabel>
                            <InputBase
                                type="number"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                placeholder="Precio Mínimo"
                                style={{ padding: '8px', borderRadius: '4px', width: '100%' }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Precio Máximo</InputLabel>
                            <InputBase
                                type="number"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                placeholder="Precio Máximo"
                                style={{ padding: '8px', borderRadius: '4px', width: '100%' }}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Button variant="contained" color="primary" style={{ marginTop: '16px' }} onClick={handleApplyFilters}>
                    Aplicar Filtros
                </Button>
            </div>
        </Popover>
    );
};

export default FilterPopup;
