// API Configuration
const API_CONFIG = {
  development: {
    baseURL: "https://bplo-user.onrender.com/api",
    fileBaseURL: "https://bplo-user.onrender.com", // for static files
  },
  production: {
    baseURL: "https://bplo-user.onrender.com/api",
    fileBaseURL: "https://bplo-user.onrender.com", // for static files
  },
};

const environment = process.env.NODE_ENV || "development";

export const API_BASE_URL = API_CONFIG[environment].baseURL;
export const FILE_BASE_URL = API_CONFIG[environment].fileBaseURL;

export const buildApiUrl = (endpoint) =>
  `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

export const buildFileUrl = (filePath) => {
  if (!filePath) return null;
  // remove leading slashes if any
  const cleanPath = filePath.replace(/^\/+/, "").replace(/\\/g, "/");
  return `${FILE_BASE_URL}/${cleanPath}`;
};
