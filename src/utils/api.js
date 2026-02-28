import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// Bridges API endpoints
export const bridgesAPI = {
  getAll: () => api.get('/bridges'),
  getById: (id) => api.get(`/bridges/${id}`),
  create: (data) => api.post('/bridges', data),
};

// Sensor Data API endpoints
export const sensorDataAPI = {
  addData: (data) => api.post('/sensor-data', data),
  getLatest: (bridgeId) => api.get(`/sensor-data/${bridgeId}/latest`),
  getHistory: (bridgeId, hours = 24) => 
    api.get(`/sensor-data/${bridgeId}/history?hours=${hours}`),
};

// Alerts API endpoints
export const alertsAPI = {
  getAlerts: (bridgeId, resolved = false) => 
    api.get(`/alerts/${bridgeId}?resolved=${resolved}`),
};

export default api;
