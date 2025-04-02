// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Carousel, InputGroup, FormControl, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await productService.getAllProducts();
        // Filter featured products for the carousel
        const featured = response.data.products.filter(product => product.featured);
        setFeaturedProducts(featured);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Container>
      {/* Hero section with search */}
      <Row className="mb-4">
        <Col md={12} className="bg-light p-5 rounded">
          <h1 className="text-center mb-4">Welcome to Our eCommerce Store</h1>
          <p className="text-center mb-4">Find the best products at the best prices.</p>
          <form onSubmit={handleSearch}>
            <InputGroup className="mb-3 mx-auto" style={{ maxWidth: '600px' }}>
              <FormControl
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="primary" type="submit">
                <FontAwesomeIcon icon={faSearch} /> Search
              </Button>
            </InputGroup>
          </form>
        </Col>
      </Row>

      {/* Featured products carousel */}
      {featuredProducts.length > 0 && (
        <Row className="mb-4">
          <Col>
            <h2 className="mb-3">Featured Products</h2>
            <Carousel variant="dark">
              {featuredProducts.map(product => (
                <Carousel.Item key={product.id}>
                  <img
                    className="d-block w-100"
                    src={product.image || "https://via.placeholder.com/800x400"}
                    alt={product.name}
                    style={{ maxHeight: '400px', objectFit: 'cover' }}
                  />
                  <Carousel.Caption className="bg-light bg-opacity-75 rounded p-3">
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <Button 
                      variant="primary" 
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      View Details
                    </Button>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>
      )}

      {/* Categories or other content can be added here */}
    </Container>
  );
};

export default HomePage;