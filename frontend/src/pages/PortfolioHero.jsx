import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { ArrowDownIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { getImageUrl, getFileUrl } from '../utils/imageUtils';

const PortfolioHero = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { portfolioData, loading, error } = usePortfolioData(username);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{error}</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const about_me = portfolioData?.about_me || null;

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Hi, I'm{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {about_me?.name || portfolioData?.profile?.first_name || portfolioData?.profile?.username || 'Developer'}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-2xl md:text-3xl text-blue-600 dark:text-blue-400 font-semibold mb-6"
            >
              {about_me?.title || 'Full Stack Developer'}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-lg text-gray-600 dark:text-gray-300 mb-8"
            >
              {about_me?.bio || 'Passionate developer creating amazing web experiences'}
            </motion.p>
            {!about_me && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
              >
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ No About Me data found. Please add your information from the dashboard.
                </p>
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href={`/${username}/contact`}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Contact Me
              </a>
              {about_me?.cv_file && (
                <motion.a
                  href={getFileUrl(about_me.cv_file)}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <ArrowDownTrayIcon className="w-5 h-5" />
                  <span>Download CV</span>
                </motion.a>
              )}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {about_me?.profile_image ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-2xl opacity-30"></div>
                <img
                  src={getImageUrl(about_me.profile_image)}
                  alt={about_me.name}
                  className="relative w-80 h-80 rounded-full object-cover mx-auto shadow-2xl"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="w-80 h-80 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mx-auto flex items-center justify-center text-white text-6xl font-bold shadow-2xl">
                {about_me?.name?.charAt(0)?.toUpperCase() || 
                 portfolioData?.profile?.first_name?.charAt(0)?.toUpperCase() || 
                 portfolioData?.profile?.username?.charAt(0)?.toUpperCase() || 
                 'D'}
              </div>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-12 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <a href={`/${username}/about`} className="cursor-pointer">
              <ArrowDownIcon className="w-6 h-6 text-gray-400" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioHero;

