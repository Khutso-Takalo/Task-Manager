import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('taskmanager_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    
    // Handle unauthorized responses
    if (error.response?.status === 401) {
      localStorage.removeItem('taskmanager_token');
      localStorage.removeItem('taskmanager_user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// User API calls
export const userAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  getByRole: (role) => api.get(`/users/role/${role}`),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  register: (userData) => api.post('/register', userData),
};

// Task API calls
export const taskAPI = {
  getAll: () => api.get('/tasks'),
  getById: (id) => api.get(`/tasks/${id}`),
  getByUser: (userId) => api.get(`/tasks/user/${userId}`),
  getMyTasks: () => {
    // Use current user's tasks endpoint
    const user = JSON.parse(localStorage.getItem('taskmanager_user') || '{}');
    return api.get(`/tasks/user/${user.userId}`);
  },
  getByStatus: (status) => api.get(`/tasks/status/${status}`),
  getByCategory: (category) => api.get(`/tasks/category/${category}`),
  create: (taskData) => api.post('/tasks', taskData),
  update: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  updateStatus: (id, status) => api.patch(`/tasks/${id}/status`, `"${status}"`, {
    headers: { 'Content-Type': 'application/json' }
  }),
  delete: (id) => api.delete(`/tasks/${id}`),
};

export default api;