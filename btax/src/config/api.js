// API Configuration
const API_CONFIG = {
  // Development environment
  development: {
    baseURL: 'https://bplo-user.onrender.com/api'
  },
  // Production environment (Render deployment)
  production: {
    baseURL: 'https://bplo-user.onrender.com/api'
  }
};

// Get current environment
const environment = process.env.NODE_ENV || 'development';

// Export the appropriate configuration
export const API_BASE_URL = API_CONFIG[environment].baseURL;

// Helper function to build API URLs
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};
