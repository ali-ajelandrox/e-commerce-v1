import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Button, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import '../styles/ProductList.css';
import { useFilters } from './FilterContext';
import { useCart } from './CartContext';

// Lista de categorías
const categories = [
    'Electronics', 'Clothing', 'Home', 'Sports', 'Toys', 'Furniture', 'Tools', 'Beauty', 'Health', 'Automobiles',
    'Books', 'Music', 'Video Games', 'Kitchen', 'Gardening', 'Pet Accessories', 'Computers', 'Telephony',
    'Photography', 'Office', 'Women’s Fashion', 'Men’s Fashion', 'Footwear', 'Watches', 'Jewelry', 'Travel Items',
    'Baby Items', 'Outdoor Sports', 'Camping', 'Fishing', 'Bicycles', 'Yoga and Meditation', 'Crafts',
    'Decoration', 'Art', 'Musical Instruments', 'Eco-friendly Products', 'Office Supplies', 'Smart Home Products',
    'Car Accessories', 'Beach Items', 'Sportswear', 'Bedding', 'Kitchenware', 'Cleaning Products',
    'Hair Care Products', 'Skin Care Products', 'Personal Care Products', 'Fitness Products',
    'Pet Products'
];
const ProductList = ({ products, isAuthenticated, setProducts }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const productsPerPage = 6;

  const { searchQuery, selectedCategory, minPrice, maxPrice } = useFilters();
  const { addToCart } = useCart(); // Usa el hook para obtener la función addToCart

  useEffect(() => {
    const filtered = products.filter(product => {
      const matchesQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
      const matchesPrice = (
        (minPrice ? product.price >= parseFloat(minPrice) : true) &&
        (maxPrice ? product.price <= parseFloat(maxPrice) : true)
      );

      return matchesQuery && matchesCategory && matchesPrice;
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, minPrice, maxPrice]);

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${productId}`);
        setProducts((prevProducts) => prevProducts.filter(product => product._id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product); // Llama a la función addToCart del contexto
    console.log(`Added ${product.name} to cart`);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const indexOfLastProduct = (currentPage + 1) * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  return (
    <div className="product-list-container">
      <Grid container spacing={2} className="product-list">
        {currentProducts.length === 0 ? (
          <Typography variant="h6" align="center" color="textSecondary" className="no-products">
            No products found
          </Typography>
        ) : (
          currentProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card className="product-card">
                <div className="product-carousel">
                  <Slider {...settings}>
                    {product.photos && product.photos.length > 0 ? (
                      product.photos.map((photo, index) => (
                        <div key={index}>
                          <img
                            src={photo}
                            alt={`Product Image ${index + 1}`}
                            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                          />
                        </div>
                      ))
                    ) : (
                      <img
                        src="/default-image.jpg"
                        alt="Default Product Image"
                        style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                      />
                    )}
                  </Slider>
                </div>
                <CardContent className="product-content">
                  <Typography variant="h6" className="product-name">{product.name || 'No name'}</Typography>
                  <Typography variant="body2" color="textSecondary" className="product-description">{product.description || 'No description'}</Typography>
                  <Typography variant="h6" color="primary" className="product-price">${product.price ? product.price.toFixed(2) : '0.00'}</Typography>
                  <div className="product-actions">
                    <Link to={`/products/${product._id}`} className="product-link">
                      <Button variant="contained" color="primary">View Details</Button>
                    </Link>
                    <Button variant="contained" color="secondary" onClick={() => handleAddToCart(product)}>
                      Add to Cart
                    </Button>
                    {isAuthenticated && (
                      <div className="product-buttons">
                        <Link to={`/edit-product/${product._id}`} className="edit-button">
                          <IconButton color="primary">
                            <EditIcon />
                          </IconButton>
                        </Link>
                        <IconButton color="secondary" onClick={() => handleDelete(product._id)} className="delete-button">
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
      {filteredProducts.length > productsPerPage && (
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          pageCount={Math.ceil(filteredProducts.length / productsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          pageClassName={'page-item'}
          pageLinkClassName={'page-link'}
          previousClassName={'page-item'}
          previousLinkClassName={'page-link'}
          nextClassName={'page-item'}
          nextLinkClassName={'page-link'}
          breakClassName={'page-item'}
          breakLinkClassName={'page-link'}
          activeClassName={'active'}
        />
      )}
    </div>
  );
};

export default ProductList;