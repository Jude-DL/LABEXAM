import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Modal, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faCheck, faShippingFast, faBan } from '@fortawesome/free-solid-svg-icons';
import { checkoutService } from '../../services/api';

const AdminCheckouts = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await checkoutService.getAllOrders();
      setOrders(response.data.orders);
      setError('');
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please refresh the page to try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'processing':
        return <Badge bg="info">Processing</Badge>;
      case 'shipped':
        return <Badge bg="primary">Shipped</Badge>;
      case 'delivered':
        return <Badge bg="success">Delivered</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const handleShowOrderDetails = (order) => {
    setCurrentOrder(order);
    setShowOrderDetailsModal(true);
  };

  const handleCloseOrderDetailsModal = () => {
    setShowOrderDetailsModal(false);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await checkoutService.updateOrderStatus(orderId, newStatus);
      
      // Update the local state
      setOrders(orders.map(order => {
        if (order.id === orderId) {
          return { ...order, status: newStatus };
        }
        return order;
      }));
      
      // If we're updating the current order in the modal, update that too
      if (currentOrder && currentOrder.id === orderId) {
        setCurrentOrder({ ...currentOrder, status: newStatus });
      }
      
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container>
      <h1 className="mb-4">Order Management</h1>
      
      {error && <p className="text-danger">{error}</p>}
      
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.user.name}</td>
                  <td>{formatDate(order.created_at)}</td>
                  <td>${order.total.toFixed(2)}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>
                    <Button 
                      variant="outline-info" 
                      size="sm" 
                      className="me-2"
                      onClick={() => handleShowOrderDetails(order)}
                    >
                      <FontAwesomeIcon icon={faEye} /> View
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No orders found</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
      
      {/* Order Details Modal */}
      <Modal 
        show={showOrderDetailsModal} 
        onHide={handleCloseOrderDetailsModal}
        size="lg"
      >
        {currentOrder && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Order #{currentOrder.id} Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row className="mb-4">
                <Col md={6}>
                  <h5>Customer Information</h5>
                  <p><strong>Name:</strong> {currentOrder.user.name}</p>
                  <p><strong>Email:</strong> {currentOrder.user.email}</p>
                  <p><strong>Order Date:</strong> {formatDate(currentOrder.created_at)}</p>
                </Col>
                <Col md={6}>
                  <h5>Shipping Address</h5>
                  <p>{currentOrder.shipping_address?.street || 'N/A'}</p>
                  <p>
                    {currentOrder.shipping_address?.city || 'N/A'}, 
                    {currentOrder.shipping_address?.state || 'N/A'} 
                    {currentOrder.shipping_address?.zip_code || 'N/A'}
                  </p>
                  <p>{currentOrder.shipping_address?.country || 'N/A'}</p>
                </Col>
              </Row>
              
              <h5>Order Items</h5>
              <Table responsive striped>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrder.items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.product.name}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              <Row className="mt-4">
                <Col md={6}>
                  <h5>Order Status</h5>
                  <div className="mb-3">
                    <strong>Current Status:</strong> {getStatusBadge(currentOrder.status)}
                  </div>
                  
                  <div className="d-flex flex-wrap gap-2">
                    <Button 
                      variant="outline-info" 
                      size="sm"
                      onClick={() => handleUpdateOrderStatus(currentOrder.id, 'processing')}
                      disabled={currentOrder.status === 'processing'}
                    >
                      <FontAwesomeIcon icon={faCheck} /> Mark Processing
                    </Button>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => handleUpdateOrderStatus(currentOrder.id, 'shipped')}
                      disabled={currentOrder.status === 'shipped' || currentOrder.status === 'delivered' || currentOrder.status === 'cancelled'}
                    >
                      <FontAwesomeIcon icon={faShippingFast} /> Mark Shipped
                    </Button>
                    <Button 
                      variant="outline-success" 
                      size="sm"
                      onClick={() => handleUpdateOrderStatus(currentOrder.id, 'delivered')}
                      disabled={currentOrder.status === 'delivered' || currentOrder.status === 'cancelled'}
                    >
                      <FontAwesomeIcon icon={faCheck} /> Mark Delivered
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleUpdateOrderStatus(currentOrder.id, 'cancelled')}
                      disabled={currentOrder.status === 'delivered' || currentOrder.status === 'cancelled'}
                    >
                      <FontAwesomeIcon icon={faBan} /> Cancel Order
                    </Button>
                  </div>
                </Col>
                <Col md={6}>
                  <Card>
                    <Card.Header>
                      <h5 className="mb-0">Order Summary</h5>
                    </Card.Header>
                    <Card.Body>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Subtotal:</span>
                        <strong>${currentOrder.subtotal?.toFixed(2) || calculateSubtotal(currentOrder.items).toFixed(2)}</strong>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Shipping:</span>
                        <strong>${currentOrder.shipping_fee?.toFixed(2) || '0.00'}</strong>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Tax:</span>
                        <strong>${currentOrder.tax?.toFixed(2) || '0.00'}</strong>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <span>Total:</span>
                        <strong className="text-primary">${currentOrder.total.toFixed(2)}</strong>
                      </div>
                    </Card.Body>
                  </Card>
                  
                  <div className="mt-3">
                    <h6>Payment Information</h6>
                    <p><strong>Method:</strong> {currentOrder.payment_method || 'Credit Card'}</p>
                    <p><strong>Status:</strong> {' '}
                      <Badge bg={currentOrder.payment_status === 'paid' ? 'success' : 'warning'}>
                        {currentOrder.payment_status || 'Paid'}
                      </Badge>
                    </p>
                  </div>
                </Col>
              </Row>
              
              {currentOrder.notes && (
                <div className="mt-3">
                  <h5>Order Notes</h5>
                  <p>{currentOrder.notes}</p>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseOrderDetailsModal}>
                Close
              </Button>
              {currentOrder.status !== 'cancelled' && currentOrder.status !== 'delivered' && (
                <Button 
                  variant="primary"
                  onClick={() => {
                    const nextStatus = getNextStatus(currentOrder.status);
                    if (nextStatus) {
                      handleUpdateOrderStatus(currentOrder.id, nextStatus);
                    }
                  }}
                >
                  {getNextStatusButtonText(currentOrder.status)}
                </Button>
              )}
            </Modal.Footer>
          </>
        )}
      </Modal>
    </Container>
  );
};

// Helper function to calculate subtotal from order items
const calculateSubtotal = (items) => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

// Helper function to determine next logical status in workflow
const getNextStatus = (currentStatus) => {
  switch (currentStatus) {
    case 'pending':
      return 'processing';
    case 'processing':
      return 'shipped';
    case 'shipped':
      return 'delivered';
    default:
      return null;
  }
};

// Helper function to get appropriate button text for next status
const getNextStatusButtonText = (currentStatus) => {
  switch (currentStatus) {
    case 'pending':
      return 'Process Order';
    case 'processing':
      return 'Mark as Shipped';
    case 'shipped':
      return 'Mark as Delivered';
    default:
      return 'Update Status';
  }
};

export default AdminCheckouts;