// API Configuration
const API_CONFIG = {
  development: {
    baseURL: 'https://bplo-user.onrender.com/api'
  },
  production: {
    baseURL: 'https://bplo-user.onrender.com/api'
  }
};

const environment = process.env.NODE_ENV || 'development';
export const API_BASE_URL = API_CONFIG[environment].baseURL;
export const buildApiUrl = (endpoint) => `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;