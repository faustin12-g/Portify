import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useEffect, useState } from 'react';
import { renderSocialIcon, getPlatformColor } from '../utils/socialIcons';
import { motion } from 'framer-motion';

const Footer = () => {
  const [socialMedia, setSocialMedia] = useState([]);

  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        // Try to fetch social media - this requires authentication
        // On public pages, this will fail gracefully
        const response = await axiosClient.get('/social-media/');
        // Handle paginated response or direct array
        const data = Array.isArray(response.data) ? response.data : response.data.results || [];
        setSocialMedia(data);
      } catch (error) {
        // Silently fail for public pages - social media is optional
        // Only log non-401 errors (401 is expected on public pages)
        if (error.response?.status !== 401 && error.response?.status !== 403) {
          console.error('Error fetching social media:', error);
        }
        setSocialMedia([]); // Ensure socialMedia is an array on error
      }
    };
    fetchSocialMedia();
  }, []);

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Portfy</h3>
            <p className="text-gray-400">
              Building amazing web experiences with modern technologies.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-primary-400 transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
            <div className="flex flex-wrap gap-3">
              {Array.isArray(socialMedia) && socialMedia.map((social, index) => (
                <motion.a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg bg-gray-800 dark:bg-gray-900 ${getPlatformColor(social.platform || social.platform_name || 'other')} transition-all`}
                  title={social.platform || social.platform_name || 'Social Media'}
                >
                  {renderSocialIcon(social.platform || social.platform_name || 'other', 'w-5 h-5')}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Portfy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
