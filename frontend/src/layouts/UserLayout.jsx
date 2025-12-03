import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../auth/useAuthStore';
import Logo from '../components/Logo';
import {
  HomeIcon,
  UserIcon,
  FolderIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  Cog6ToothIcon,
  ShareIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  LinkIcon,
  GlobeAltIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoImage, setLogoImage] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTogglingPublish, setIsTogglingPublish] = useState(false);
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchLogo();
    fetchUserProfile();
  }, []);

  const fetchLogo = async () => {
    try {
      const response = await axiosClient.get('/about/');
      const aboutData = Array.isArray(response.data) ? response.data : response.data.results || [];
      if (aboutData.length > 0 && aboutData[0].logo_image) {
        setLogoImage(aboutData[0].logo_image);
      }
    } catch (error) {
      console.error('Error fetching logo:', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axiosClient.get('/auth/me/');
      setUserProfile(response.data);
      if (response.data.username_slug) {
        setPortfolioUrl(`${window.location.origin}/${response.data.username_slug}`);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleGeneratePortfolio = async () => {
    setIsGenerating(true);
    try {
      // Update profile to publish portfolio
      const response = await axiosClient.patch('/auth/profile/', {
        portfolio_published: true,
      });
      setUserProfile(response.data);
      if (response.data.username_slug) {
        setPortfolioUrl(`${window.location.origin}/${response.data.username_slug}`);
      }
      toast.success('Portfolio published successfully!');
    } catch (error) {
      toast.error('Failed to publish portfolio');
      console.error('Error publishing portfolio:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTogglePublish = async () => {
    setIsTogglingPublish(true);
    try {
      const newStatus = !userProfile?.portfolio_published;
      const response = await axiosClient.patch('/auth/profile/', {
        portfolio_published: newStatus,
      });
      setUserProfile(response.data);
      toast.success(newStatus ? 'Portfolio published!' : 'Portfolio unpublished');
    } catch (error) {
      toast.error('Failed to update portfolio status');
      console.error('Error updating portfolio:', error);
    } finally {
      setIsTogglingPublish(false);
    }
  };

  const copyPortfolioUrl = () => {
    if (portfolioUrl) {
      navigator.clipboard.writeText(portfolioUrl);
      toast.success('Portfolio URL copied to clipboard!');
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'About Me', href: '/dashboard/about', icon: UserIcon },
    { name: 'Projects', href: '/dashboard/projects', icon: FolderIcon },
    { name: 'Experience', href: '/dashboard/experience', icon: BriefcaseIcon },
    { name: 'Education', href: '/dashboard/education', icon: AcademicCapIcon },
    { name: 'Skills', href: '/dashboard/skills', icon: Cog6ToothIcon },
    { name: 'Social Media', href: '/dashboard/social-media', icon: ShareIcon },
    { name: 'Messages', href: '/dashboard/messages', icon: EnvelopeIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <Logo size="md" animated={false} logoImage={logoImage} />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <nav className="mt-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 text-sm font-medium ${
                      location.pathname === item.href
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex items-center flex-shrink-0 px-4 py-4 border-b border-gray-200 dark:border-gray-700">
            <Logo size="md" animated={false} logoImage={logoImage} />
          </div>
          <div className="flex flex-col flex-grow overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    location.pathname === item.href
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
              >
                <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 lg:px-8">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-4">
            {userProfile && (
              <div className="hidden md:flex items-center gap-3 mr-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {userProfile.first_name?.charAt(0) || userProfile.username?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {userProfile.first_name && userProfile.last_name
                      ? `${userProfile.first_name} ${userProfile.last_name}`
                      : userProfile.username || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    @{userProfile.username}
                  </p>
                </div>
              </div>
            )}
            {userProfile && (
              <div className="flex items-center gap-2">
                {portfolioUrl && (
                  <button
                    onClick={copyPortfolioUrl}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                  >
                    <LinkIcon className="h-4 w-4" />
                    Copy Portfolio URL
                  </button>
                )}
                {userProfile.portfolio_published ? (
                  <>
                    <Link
                      to={`/${userProfile.username_slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                    >
                      <GlobeAltIcon className="h-4 w-4" />
                      View Portfolio
                    </Link>
                    <button
                      onClick={handleTogglePublish}
                      disabled={isTogglingPublish}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isTogglingPublish ? (
                        <>
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Unpublishing...
                        </>
                      ) : (
                        'Unpublish'
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleGeneratePortfolio}
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Publishing...
                      </>
                    ) : (
                      'Generate Portfolio'
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;

