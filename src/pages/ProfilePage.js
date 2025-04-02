import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Formik } from 'formik';
import * as Yup from 'yup';

const ProfilePage = () => {
  const { currentUser, updateProfile } = useAuth();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // In a real application, you would fetch the user's profile from the backend
        // For now, we'll just use the current user data from auth context
        setProfileData({
          name: currentUser.name || '',
          email: currentUser.email || '',
          address: currentUser.address || '',
          city: currentUser.city || '',
          state: currentUser.state || '',
          zipCode: currentUser.zipCode || '',
          phone: currentUser.phone || ''
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    address: Yup.string(),
    city: Yup.string(),
    state: Yup.string(),
    zipCode: Yup.string(),
    phone: Yup.string()
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      setSuccess('');
      await updateProfile(values);
      setSuccess('Profile updated successfully!');
    } catch (error) {
      console.error('Update profile error:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Container><p>Loading profile...</p></Container>;
  }

  return (
    <Container>
      <h1 className="mb-4">Your Profile</h1>
      
      <Row>
        <Col md={8}>
          <Card>
            <Card.Header as="h5">Profile Information</Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              {profileData && (
                <Formik
                  initialValues={profileData}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.name && errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.name}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.email && errors.email}
                          disabled
                        />
                        <Form.Text className="text-muted">
                          Email cannot be changed. Contact support for assistance.
                        </Form.Text>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          type="text"
                          name="address"
                          value={values.address}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.address && errors.address}
                        />
                      </Form.Group>

                      <Row className="mb-3">
                        <Form.Group as={Col} md={6}>
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            type="text"
                            name="city"
                            value={values.city}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.city && errors.city}
                          />
                        </Form.Group>

                        <Form.Group as={Col} md={3}>
                          <Form.Label>State</Form.Label>
                          <Form.Control
                            type="text"
                            name="state"
                            value={values.state}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.state && errors.state}
                          />
                        </Form.Group>

                        <Form.Group as={Col} md={3}>
                          <Form.Label>ZIP Code</Form.Label>
                          <Form.Control
                            type="text"
                            name="zipCode"
                            value={values.zipCode}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.zipCode && errors.zipCode}
                          />
                        </Form.Group>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          type="text"
                          name="phone"
                          value={values.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.phone && errors.phone}
                        />
                      </Form.Group>

                      <Button
                        variant="primary"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </Form>
                  )}
                </Formik>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="mb-4">
            <Card.Header as="h5">Account Security</Card.Header>
            <Card.Body>
              <Button variant="outline-secondary" className="w-100 mb-3">
                Change Password
              </Button>
              <Button variant="outline-danger" className="w-100">
                Delete Account
              </Button>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Header as="h5">Order History</Card.Header>
            <Card.Body>
              <p>View your past orders and track current deliveries.</p>
              <Button variant="outline-primary" className="w-100">
                View Orders
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;