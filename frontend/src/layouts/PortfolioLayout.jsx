import { Outlet, useParams } from 'react-router-dom';
import PortfolioNavbar from '../components/PortfolioNavbar';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { getImageUrl } from '../utils/imageUtils';

const PortfolioLayout = () => {
  const { username } = useParams();
  const [logoImage, setLogoImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reservedRoutes = ['register', 'login', 'verify-email-sent', 'pending-approval', 'dashboard', 'admin', 'portfolio', 'reset-password', 'forgot-password', 'verify-email'];
    
    // Don't fetch if it's a reserved route
    if (reservedRoutes.includes(username)) {
      setLoading(false);
      return;
    }

    const fetchLogo = async () => {
      try {
        const response = await axiosClient.get(`/portfolio/${username}/`);
        if (response.data?.about_me?.logo_image) {
          setLogoImage(getImageUrl(response.data.about_me.logo_image));
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchLogo();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PortfolioNavbar logoImage={logoImage} username={username} />
      <Outlet />
      <Footer />
    </div>
  );
};

export default PortfolioLayout;

