// src/components/ProductCard.js
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <Card className="h-100">
      {product.image ? (
        <Card.Img variant="top" src={product.image} alt={product.name} />
      ) : (
        <Card.Img variant="top" src="https://via.placeholder.com/300x200" alt="Product placeholder" />
      )}
      <Card.Body className="d-flex flex-column">
        <Card.Title>{product.name}</Card.Title>
        <Card.Text className="text-truncate">{product.description}</Card.Text>
        <Card.Text className="mt-auto">
          <strong>${product.price.toFixed(2)}</strong>
        </Card.Text>
        <div className="d-flex justify-content-between mt-2">
          <Button 
            as={Link} 
            to={`/products/${product.id}`} 
            variant="outline-primary"
          >
            View Details
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            <FontAwesomeIcon icon={faCartPlus} /> Add to Cart
          </Button>
        </div>
        {product.stock <= 0 && (
          <p className="text-danger mt-2 mb-0">Out of Stock</p>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProductCard;