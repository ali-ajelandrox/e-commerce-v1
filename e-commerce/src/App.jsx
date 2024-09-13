import React, { useState, useEffect } from 'react';  
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import CategoriesPage from './components/CategoriesPage';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Login from './components/Login';
import Register from './components/Register';
import BuyerDashboard from './components/BuyerDashboard';
import SellerDashboard from './components/SellerDashboard';
import EditProduct from './components/EditProduct'; // Importa el componente EditProduct
import ProductList from './components/ProductList'; // Asegúrate de importar ProductList
import { FilterProvider } from './components/FilterContext'; // Importa el FilterProvider
import { CartProvider } from './components/CartContext'; // Importa el CartProvider
import axios from 'axios';

const App = () => {
  const [products, setProducts] = useState([]);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);

  useEffect(() => {
    // Fetch products and set the state
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleOpenFilterDialog = () => {
    setOpenFilterDialog(true);
  };

  const handleCloseFilterDialog = () => {
    setOpenFilterDialog(false);
  };

  return (
    <FilterProvider> {/* Envuelve la aplicación con FilterProvider */}
      <CartProvider>  {/* Envuelve la aplicación con CartProvider */}
        <Router>
          <Navbar onOpenFilterDialog={handleOpenFilterDialog} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/seller-dashboard/:id" element={<SellerDashboard />} />
            <Route path="/buyer-dashboard/:userId" element={<BuyerDashboard />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/edit-product/:productId" element={<EditProduct />} /> {/* Agrega esta ruta */}
            <Route 
              path="/product-list" 
              element={<ProductList 
                products={products} 
                setProducts={setProducts}
                openFilterDialog={openFilterDialog}
                onOpenFilterDialog={handleOpenFilterDialog}
              />} 
            />
          </Routes>
        </Router>
      </CartProvider> 
    </FilterProvider>
  );
};

export default App;
