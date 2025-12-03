import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import axiosClient from '../api/axiosClient';
import { Link } from 'react-router-dom';
import { getImageUrl, getFileUrl } from '../utils/imageUtils';

const Home = () => {
  const [aboutMe, setAboutMe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutMe = async () => {
      try {
        const response = await axiosClient.get('/about/');
        // Handle both array and paginated responses
        const aboutData = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];
        if (aboutData.length > 0) {
          setAboutMe(aboutData[0]);
        }
      } catch (error) {
        console.error('Error fetching about me:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutMe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
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
              <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                {aboutMe?.name || 'Developer'}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-2xl md:text-3xl text-primary-600 dark:text-primary-400 font-semibold mb-6"
            >
              {aboutMe?.title || 'Full Stack Developer'}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-lg text-gray-600 dark:text-gray-300 mb-8"
            >
              {aboutMe?.bio || 'Passionate developer creating amazing web experiences'}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/contact"
                className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Hire Me
              </Link>
              {aboutMe?.cv_file && (
                <motion.a
                  href={getFileUrl(aboutMe.cv_file)}
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
            {aboutMe?.profile_image ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full blur-2xl opacity-30"></div>
                <img
                  src={getImageUrl(aboutMe.profile_image)}
                  alt={aboutMe.name}
                  className="relative w-80 h-80 rounded-full object-cover mx-auto shadow-2xl"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="w-80 h-80 rounded-full bg-gradient-to-r from-primary-600 to-primary-400 mx-auto flex items-center justify-center text-white text-6xl font-bold shadow-2xl">
                {aboutMe?.name?.charAt(0) || 'D'}
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
            <ArrowDownIcon className="w-6 h-6 text-gray-400" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;

