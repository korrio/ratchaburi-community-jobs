import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:5050';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
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

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const apiEndpoints = {
  // Service providers
  getProviders: (params?: any) => api.get('/providers', { params }),
  getProvider: (id: string) => api.get(`/providers/${id}`),
  createProvider: (data: any) => api.post('/providers', data),
  updateProvider: (id: string, data: any) => api.put(`/providers/${id}`, data),
  deleteProvider: (id: string) => api.delete(`/providers/${id}`),
  
  // Service categories
  getCategories: () => api.get('/providers/categories'),
  createCategory: (data: any) => api.post('/providers/categories', data),
  updateCategory: (id: string, data: any) => api.put(`/providers/categories/${id}`, data),
  deleteCategory: (id: string) => api.delete(`/providers/categories/${id}`),
  
  // Customers
  getCustomers: (params?: any) => api.get('/customers', { params }),
  getCustomer: (id: string) => api.get(`/customers/${id}`),
  createCustomer: (data: any) => api.post('/customers', data),
  updateCustomer: (id: string, data: any) => api.put(`/customers/${id}`, data),
  deleteCustomer: (id: string) => api.delete(`/customers/${id}`),
  
  // Job matches
  getMatches: (params?: any) => api.get('/matches', { params }),
  getMatch: (id: string) => api.get(`/matches/${id}`),
  createMatch: (data: any) => api.post('/matches', data),
  updateMatchStatus: (id: string, data: any) => api.put(`/matches/${id}/status`, data),
  getAutoMatches: (params?: any) => api.get('/auto-matches', { params }),
  getMatchStats: () => api.get('/matches/stats'),
  
  // Authentication
  login: (data: any) => api.post('/auth/login', data),
  verifyToken: () => api.get('/auth/verify'),
  
  // Database seeding
  seedDatabase: () => api.post('/seed'),
  
  // Questionnaires
  submitProviderQuestionnaire: (matchId: string, data: any) => api.post(`/matches/${matchId}/provider-questionnaire`, data),
  submitCustomerQuestionnaire: (matchId: string, data: any) => api.post(`/matches/${matchId}/customer-questionnaire`, data),
  getProviderQuestionnaire: (matchId: string) => api.get(`/matches/${matchId}/provider-questionnaire`),
  getCustomerQuestionnaire: (matchId: string) => api.get(`/matches/${matchId}/customer-questionnaire`),
  getQuestionnaireStats: () => api.get('/questionnaires/stats'),
  
  // Job Progress
  getJobProgress: (params?: any) => api.get('/job-progress', { params }),
  getJobProgressById: (matchId: string) => api.get(`/job-progress/${matchId}`),
  updateJobProgress: (matchId: string, data: any) => api.post(`/job-progress/${matchId}/update`, data),
  submitCustomerFeedback: (matchId: string, data: any) => api.post(`/job-progress/${matchId}/customer-feedback`, data),
};

export default api;