// src/pages/CartPage.js
import React from 'react';
import { Container, Row, Col, Table, Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faMinus, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { checkoutService } from '../services/api';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!currentUser) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    try {
      // Format cart items for API
      const items = cartItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity
      }));

      await checkoutService.processCheckout(items);
      clearCart();
      navigate('/checkout-success');
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container>
        <h1 className="mb-4">Your Cart</h1>
        <div className="text-center py-5">
          <FontAwesomeIcon icon={faShoppingCart} size="4x" className="mb-3 text-muted" />
          <h3>Your cart is empty</h3>
          <p className="mb-4">Looks like you haven't added any products to your cart yet.</p>
          <Button as={Link} to="/products" variant="primary">
            Continue Shopping
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-4">Your Cart</h1>
      
      <Row>
        <Col lg={8}>
          <Table responsive>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item.product_id}>
                  <td>{item.name}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </Button>
                      <span className="mx-2">{item.quantity}</span>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </Button>
                    </div>
                  </td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => removeFromCart(item.product_id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-between mb-4">
            <Button 
              variant="outline-secondary"
              onClick={clearCart}
            >
              Clear Cart
            </Button>
            <Button 
              as={Link} 
              to="/products" 
              variant="outline-primary"
            >
              Continue Shopping
            </Button>
          </div>
        </Col>
        
        <Col lg={4}>
          <Card>
            <Card.Header as="h5">Order Summary</Card.Header>
            <Card.Body>
              <Table borderless>
                <tbody>
                  <tr>
                    <td>Subtotal:</td>
                    <td className="text-end">${getCartTotal().toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Shipping:</td>
                    <td className="text-end">Free</td>
                  </tr>
                  <tr>
                    <td><strong>Total:</strong></td>
                    <td className="text-end"><strong>${getCartTotal().toFixed(2)}</strong></td>
                  </tr>
                </tbody>
              </Table>
              <Button 
                variant="success" 
                size="lg" 
                className="w-100"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;