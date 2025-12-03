import { Navigate } from 'react-router-dom';
import useAuthStore from './useAuthStore';
import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState(null); // null = checking, true/false = result
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isAuthenticated) {
        setIsAuthorized(false);
        setLoading(false);
        return;
      }

      try {
        const response = await axiosClient.get('/auth/me/');
        const { is_staff, is_superuser } = response.data;
        
        if (is_staff || is_superuser) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [isAuthenticated]);

  if (loading || isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You must be a staff member or superuser to access this area.
          </p>
          <Navigate to="/dashboard" replace />
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;

