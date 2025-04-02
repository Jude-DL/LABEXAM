// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include auth token in requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  register: (userData) => apiClient.post('/register', userData),
  login: (credentials) => apiClient.post('/login', credentials),
  logout: () => apiClient.post('/logout'),
  getCurrentUser: () => apiClient.get('/user'),
  updateProfile: (userData) => apiClient.put('/user/profile', userData),
};

// Product services
export const productService = {
  getAllProducts: () => apiClient.get('/products'),
  searchProducts: (query) => apiClient.get(`/products/search?search=${query}`),
  
  // Admin only
  getProduct: (id) => apiClient.get(`/admin/products/${id}`),
  createProduct: (productData) => apiClient.post('/admin/products', productData),
  updateProduct: (id, productData) => apiClient.put(`/admin/products/${id}`, productData),
  deleteProduct: (id) => apiClient.delete(`/admin/products/${id}`),
};

// Checkout/Order services 
export const checkoutService = {
  processCheckout: (cartItems) => apiClient.post('/checkout', { cart_items: cartItems }),
  
  // Admin only
  getAllOrders: () => apiClient.get('/admin/orders'),
  getOrder: (id) => apiClient.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, status) => apiClient.put(`/admin/orders/${id}/status`, { status }),
  filterOrdersByDate: (date) => apiClient.get(`/admin/orders/filter-by-date?date=${date}`),
};

export default {
  auth: authService,
  products: productService,
  checkout: checkoutService,
};