import React, { useState, useEffect } from 'react';   
import { AppBar, Toolbar, IconButton, Typography, InputBase, Popover, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useNavigate } from 'react-router-dom';
import Cart from './Cart';
import { useFilters } from './FilterContext';
import FilterPopup from './FilterPopup'; // Importa el componente FilterPopup

const Navbar = ({ cartItems, onRemoveFromCart }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [filterAnchorEl, setFilterAnchorEl] = useState(null); // Estado para el Popover de filtros
    const navigate = useNavigate();

    const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, minPrice, setMinPrice, maxPrice, setMaxPrice } = useFilters();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const id = localStorage.getItem('userId');
        const role = localStorage.getItem('role');
        if (token && id && role) {
            setIsAuthenticated(true);
            setUserId(id);
            setUserRole(role);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const handleCartClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseCart = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        setIsAuthenticated(false);
        setUserId(null);
        setUserRole(null);
        navigate('/login');
    };

    const handleDashboardRedirect = () => {
        if (userRole === 'seller') {
            navigate(`/seller-dashboard/${userId}`);
        } else if (userRole === 'buyer') {
            navigate(`/buyer-dashboard/${userId}`);
        } else {
            console.error('Rol de usuario desconocido');
        }
    };

    const handleFilterClick = (event) => {
        setFilterAnchorEl(event.currentTarget);
    };

    const handleCloseFilterPopup = () => {
        setFilterAnchorEl(null);
    };

    const openFilterPopup = Boolean(filterAnchorEl);

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="home" onClick={() => navigate('/')}>
                    <HomeIcon />
                </IconButton>
                <IconButton color="inherit" aria-label="categories" onClick={() => navigate('/categories')}>
                    <CategoryIcon />
                </IconButton>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    My E-Commerce
                </Typography>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <InputBase
                        placeholder="Buscar…"
                        inputProps={{ 'aria-label': 'search' }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ color: 'inherit', backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: '4px', padding: '0 8px' }}
                    />
                    <IconButton type="submit" color="inherit" aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </div>
                <IconButton
                    edge="end"
                    color="inherit"
                    aria-label="cart"
                    aria-describedby={open ? 'simple-popover' : undefined}
                    onClick={handleCartClick}
                >
                    <ShoppingCartIcon />
                </IconButton>
                <Popover
                    id="simple-popover"
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={handleCloseCart}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                >
                    <Cart cartItems={cartItems} onRemoveFromCart={onRemoveFromCart} />
                </Popover>

                <IconButton color="inherit" onClick={handleFilterClick} style={{ marginLeft: '16px' }}>
                    <FilterListIcon />
                </IconButton>
                <Popover
                    open={openFilterPopup}
                    anchorEl={filterAnchorEl}
                    onClose={handleCloseFilterPopup}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <FilterPopup anchorEl={filterAnchorEl} onClose={handleCloseFilterPopup} />
                </Popover>

                {isAuthenticated ? (
                    <>
                        <IconButton color="inherit" onClick={handleDashboardRedirect} style={{ marginLeft: '16px' }}>
                            <AccountCircleIcon />
                        </IconButton>
                        <Button color="inherit" onClick={handleLogout} style={{ marginLeft: '16px' }}>
                            Cerrar Sesión
                        </Button>
                    </>
                ) : (
                    <>
                        <Button color="inherit" onClick={() => navigate('/login')} style={{ marginLeft: '16px' }}>
                            Iniciar Sesión
                        </Button>
                        <Button color="inherit" onClick={() => navigate('/register')} style={{ marginLeft: '16px' }}>
                            Registrar
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
