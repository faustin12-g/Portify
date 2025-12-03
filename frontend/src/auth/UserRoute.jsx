import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from './useAuthStore';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';

const UserRoute = ({ children }) => {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [isApproved, setIsApproved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      // Check if user is authenticated
      if (!checkAuth()) {
        setIsChecking(false);
        return;
      }

      try {
        // Fetch user profile to check approval status
        const response = await axiosClient.get('/auth/me/');
        const profile = response.data;
        
        // Redirect staff/superusers to admin dashboard
        if (profile.is_staff || profile.is_superuser) {
          window.location.href = '/admin';
          return;
        }
        
        if (!profile.is_approved) {
          setIsApproved(false);
        } else {
          setIsApproved(true);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // If error, still allow access (might be network issue)
        setIsApproved(true);
      } finally {
        setIsLoading(false);
        setIsChecking(false);
      }
    };

    verifyUser();
  }, [checkAuth]);

  if (isChecking || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isApproved) {
    return <Navigate to="/pending-approval" replace />;
  }

  return children;
};

export default UserRoute;

