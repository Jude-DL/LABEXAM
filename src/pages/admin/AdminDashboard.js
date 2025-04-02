// src/pages/admin/AdminDashboard.js
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faShoppingCart, faUsers } from '@fortawesome/free-solid-svg-icons';

const AdminDashboard = () => {
  return (
    <Container>
      <h1 className="mb-4">Admin Dashboard</h1>
      
      <Row>
        <Col md={4} className="mb-4">
          <Card as={Link} to="/admin/products" className="h-100 text-decoration-none">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
              <FontAwesomeIcon icon={faBoxOpen} size="3x" className="mb-3 text-primary" />
              <Card.Title>Manage Products</Card.Title>
              <Card.Text className="text-center">
                Add, edit, and delete products from your store inventory.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card as={Link} to="/admin/checkouts" className="h-100 text-decoration-none">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
              <FontAwesomeIcon icon={faShoppingCart} size="3x" className="mb-3 text-primary" />
              <Card.Title>View Transactions</Card.Title>
              <Card.Text className="text-center">
                Monitor and manage customer orders and transactions.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
              <FontAwesomeIcon icon={faUsers} size="3x" className="mb-3 text-primary" />
              <Card.Title>User Management</Card.Title>
              <Card.Text className="text-center">
                Coming soon: Manage user accounts and permissions.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;