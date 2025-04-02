// src/pages/CheckoutSuccessPage.js
import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faShoppingBag } from '@fortawesome/free-solid-svg-icons';

const CheckoutSuccessPage = () => {
  return (
    <Container className="py-5 text-center">
      <FontAwesomeIcon icon={faCheckCircle} size="4x" className="text-success mb-4" />
      <h1>Thank You for Your Order!</h1>
      <Alert variant="success" className="my-4">
        Your order has been successfully placed and is being processed.
      </Alert>
      <p>You will receive an email confirmation shortly.</p>
      <Button as={Link} to="/products" variant="primary" className="mt-3">
        <FontAwesomeIcon icon={faShoppingBag} className="me-2" />
        Continue Shopping
      </Button>
    </Container>
  );
};

export default CheckoutSuccessPage;
