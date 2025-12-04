import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'https://muneza12.pythonanywhere.com/api/v1';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // If FormData, remove Content-Type header to let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't try to refresh token for login/register endpoints (they return 401 on failure)
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/login/') || 
                           originalRequest?.url?.includes('/auth/register/');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);
          originalRequest.headers.Authorization = `Bearer ${access}`;

          return axiosClient(originalRequest);
        } else {
          // No refresh token - return original error instead of "No refresh token"
          return Promise.reject(error);
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // Return original error, not refresh error
        return Promise.reject(error);
      }
    }

    // Don't show toast for 401 errors (handled above) or if it's a validation error
    if (error.response?.status !== 401 && error.response?.status !== 400) {
      if (error.response?.status >= 500) {
        toast.error('Server error. Please try again later.');
      } else if (error.response?.status === 404) {
        toast.error('Resource not found.');
      } else if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
