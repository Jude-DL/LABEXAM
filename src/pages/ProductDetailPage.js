// src/pages/ProductDetailPage.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { productService } from '../services/api';
import { useCart } from '../contexts/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await productService.getProduct(id);
        setProduct(response.data.product);
        setError(null);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  if (loading) {
    return <Container><p>Loading product details...</p></Container>;
  }

  if (error || !product) {
    return (
      <Container>
        <Alert variant="danger">{error || 'Product not found'}</Alert>
        <Button variant="primary" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} /> Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Button variant="outline-primary" className="mb-4" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back to Products
      </Button>
      
      <Card>
        <Row className="g-0">
          <Col md={6}>
            <Card.Img 
              src={product.image || "https://via.placeholder.com/600x400"} 
              alt={product.name} 
              className="img-fluid rounded-start"
            />
          </Col>
          <Col md={6}>
            <Card.Body>
              <Card.Title as="h2">{product.name}</Card.Title>
              <Card.Text className="fs-4 text-primary mb-4">
                ${product.price.toFixed(2)}
              </Card.Text>
              <Card.Text>{product.description}</Card.Text>
              
              <div className="mb-3">
                <p className={product.stock > 0 ? 'text-success' : 'text-danger'}>
                  {product.stock > 0 
                    ? `In Stock (${product.stock} available)` 
                    : 'Out of Stock'}
                </p>
              </div>
              
              {product.stock > 0 && (
                <Form className="mb-3">
                  <Form.Group as={Row} className="align-items-center">
                    <Form.Label column sm={4}>Quantity:</Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={handleQuantityChange}
                      />
                    </Col>
                  </Form.Group>
                </Form>
              )}
              
              <Button 
                variant="primary" 
                size="lg" 
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="w-100"
              >
                <FontAwesomeIcon icon={faCartPlus} /> Add to Cart
              </Button>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default ProductDetailPage;