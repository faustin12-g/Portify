import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

export const usePortfolioData = (username) => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      const reservedRoutes = ['register', 'login', 'verify-email-sent', 'pending-approval', 'dashboard', 'admin', 'portfolio', 'reset-password', 'forgot-password', 'verify-email'];
      if (reservedRoutes.includes(username)) {
        setError('Invalid portfolio URL.');
        setLoading(false);
        return;
      }

      try {
        const response = await axiosClient.get(`/portfolio/${username}/`);
        setPortfolioData(response.data);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
        if (error.response?.status === 404) {
          setError('Portfolio not found.');
        } else if (error.response?.status === 403) {
          setError('Portfolio is not published.');
        } else {
          setError('Error loading portfolio.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchPortfolio();
    }
  }, [username]);

  return { portfolioData, loading, error };
};

