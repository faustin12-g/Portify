import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  FolderIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  Cog6ToothIcon,
  UserIcon,
  ShareIcon,
  EnvelopeIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import useAuthStore from '../auth/useAuthStore';
import Logo from '../components/Logo';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axiosClient from '../api/axiosClient';
import { getImageUrl } from '../utils/imageUtils';

const SuperAdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoImage, setLogoImage] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch logo
        const logoResponse = await axiosClient.get('/about/');
        const aboutData = Array.isArray(logoResponse.data)
          ? logoResponse.data
          : logoResponse.data.results || [];
        
        if (aboutData.length > 0 && aboutData[0].logo_image) {
          setLogoImage(getImageUrl(aboutData[0].logo_image));
        }

        // Fetch user info
        const userResponse = await axiosClient.get('/auth/me/');
        setUserInfo(userResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const menuItems = [
    { name: 'System Overview', path: '/admin', icon: HomeIcon },
    { name: 'Users Management', path: '/admin/users', icon: UsersIcon },
    { name: 'Messages Management', path: '/admin/messages', icon: EnvelopeIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md p-4">
        <div className="flex items-center justify-between">
          <Logo size="md" animated={false} logoImage={logoImage} />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-20'
          } bg-gradient-to-b from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 shadow-xl min-h-screen fixed left-0 top-0 pt-16 lg:pt-0 transition-all duration-300 z-40 hidden lg:block`}
        >
          <div className="p-6">
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-2">
                <ShieldCheckIcon className="w-6 h-6 text-yellow-400" />
                {sidebarOpen && (
                  <span className="text-white font-bold text-lg">Super Admin</span>
                )}
              </div>
              <Logo size="md" animated={false} logoImage={logoImage} />
            </div>
            {userInfo && sidebarOpen && (
              <div className="mb-6 p-3 bg-gray-800 rounded-lg">
                <p className="text-white text-sm font-semibold">
                  {userInfo.first_name || userInfo.username}
                </p>
                <p className="text-gray-400 text-xs">
                  {userInfo.is_superuser ? 'Superuser' : 'Staff'}
                </p>
              </div>
            )}
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-yellow-500 text-gray-900 shadow-lg'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </nav>
            <button
              onClick={handleLogout}
              className="mt-8 w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 h-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 pt-20">
                <div className="flex items-center space-x-2 mb-6">
                  <ShieldCheckIcon className="w-6 h-6 text-yellow-400" />
                  <span className="text-white font-bold text-lg">Super Admin</span>
                </div>
                {userInfo && (
                  <div className="mb-6 p-3 bg-gray-800 rounded-lg">
                    <p className="text-white text-sm font-semibold">
                      {userInfo.first_name || userInfo.username}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {userInfo.is_superuser ? 'Superuser' : 'Staff'}
                    </p>
                  </div>
                )}
                <nav className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                          isActive
                            ? 'bg-yellow-500 text-gray-900 shadow-lg'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
                <button
                  onClick={handleLogout}
                  className="mt-8 w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Main Content */}
        <main className={`flex-1 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} transition-all duration-300 pt-16 lg:pt-0`}>
          {/* Top Bar */}
          <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShieldCheckIcon className="w-6 h-6 text-yellow-500" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {menuItems.find(item => item.path === location.pathname)?.name || 'Super Admin Dashboard'}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Manage all users and their portfolio data
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {userInfo && (
                  <div className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                    <ShieldCheckIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                      {userInfo.is_superuser ? 'Superuser' : 'Staff Admin'}
                    </span>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="hidden lg:flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;

