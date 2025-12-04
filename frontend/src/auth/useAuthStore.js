import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosClient from '../api/axiosClient';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (usernameOrEmail, password) => {
        set({ isLoading: true });
        try {
          const response = await axiosClient.post('/auth/login/', {
            username_or_email: usernameOrEmail,
            password,
          });

          const { access, refresh } = response.data;
          localStorage.setItem('access_token', access);
          localStorage.setItem('refresh_token', refresh);

          // Fetch user data to check if staff/superuser
          try {
            const userResponse = await axiosClient.get('/auth/me/');
            set({
              isAuthenticated: true,
              user: userResponse.data,
              isLoading: false,
            });
            return { success: true, user: userResponse.data };
          } catch (userError) {
            // If fetching user fails, still set authenticated
            set({
              isAuthenticated: true,
              isLoading: false,
            });
            return { success: true };
          }
        } catch (error) {
          set({ isLoading: false });
          // Extract error message - check multiple possible formats
          let errorMessage = 'Login failed';
          if (error.response?.data) {
            // Try different error message formats
            errorMessage = error.response.data.detail || 
                          error.response.data.error || 
                          error.response.data.message ||
                          (typeof error.response.data === 'string' ? error.response.data : errorMessage);
          } else if (error.message && !error.message.includes('refresh')) {
            // Only use error.message if it's not about token refresh
            errorMessage = error.message;
          }
          return {
            success: false,
            error: errorMessage,
          };
        }
      },

      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      checkAuth: () => {
        const token = localStorage.getItem('access_token');
        if (token) {
          // Verify token is still valid by checking expiry (basic check)
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const now = Date.now() / 1000;
            if (payload.exp && payload.exp > now) {
              set({ isAuthenticated: true });
              return true;
            } else {
              // Token expired
              get().logout();
              return false;
            }
          } catch (e) {
            // Invalid token format
            get().logout();
            return false;
          }
        }
        set({ isAuthenticated: false });
        return false;
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
