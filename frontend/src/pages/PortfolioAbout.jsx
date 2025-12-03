import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { getImageUrl } from '../utils/imageUtils';
import SectionTitle from '../components/SectionTitle';
import {
  UserGroupIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';

const PortfolioAbout = () => {
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
  const projects = portfolioData?.projects || [];

  return (
    <section className="py-20 bg-white dark:bg-gray-800 min-h-screen pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title="About Me" subtitle="Get to know me" center />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-12">
          {/* Left Side - Portrait Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Blue layer behind image */}
            <div className="absolute -top-8 -left-8 w-full h-full bg-blue-500 dark:bg-blue-600 rounded-3xl opacity-20 -z-10"></div>
            
            {/* Portrait Image with organic shape */}
            <div className="relative">
              {about_me?.profile_image ? (
                <img
                  src={getImageUrl(about_me.profile_image)}
                  alt={about_me.name || 'Profile'}
                  className="w-full max-w-md rounded-3xl object-cover shadow-2xl"
                  style={{
                    clipPath: 'polygon(0% 0%, 100% 0%, 95% 100%, 5% 100%)',
                    borderRadius: '1.5rem',
                  }}
                />
              ) : (
                <div 
                  className="w-full max-w-md h-96 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-6xl font-bold shadow-2xl"
                  style={{
                    clipPath: 'polygon(0% 0%, 100% 0%, 95% 100%, 5% 100%)',
                    borderRadius: '1.5rem',
                  }}
                >
                  {about_me?.name?.charAt(0)?.toUpperCase() || 
                   portfolioData?.profile?.first_name?.charAt(0)?.toUpperCase() || 
                   portfolioData?.profile?.username?.charAt(0)?.toUpperCase() || 
                   'D'}
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >

            {/* Statistics Cards */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {/* Experience Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl shadow-lg"
              >
                <div className="flex flex-col items-center text-center">
                  <BuildingOfficeIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
                  <p className="text-gray-900 dark:text-white font-semibold text-sm mb-1">Experience</p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">
                    {about_me?.years_of_experience ? `${about_me.years_of_experience}+ years` : '1+ years'}
                  </p>
                </div>
              </motion.div>

              {/* Clients Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl shadow-lg"
              >
                <div className="flex flex-col items-center text-center">
                  <UserGroupIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
                  <p className="text-gray-900 dark:text-white font-semibold text-sm mb-1">Clients</p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">
                    {about_me?.clients !== null && about_me?.clients !== undefined ? `${about_me.clients}+ clients` : 'N/A'}
                  </p>
                </div>
              </motion.div>

              {/* Projects Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl shadow-lg"
              >
                <div className="flex flex-col items-center text-center">
                  <BriefcaseIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
                  <p className="text-gray-900 dark:text-white font-semibold text-sm mb-1">Projects</p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">
                    {projects.length} {projects.length === 1 ? 'project' : 'projects'}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Description Paragraph */}
            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mt-8">
              {about_me?.bio || 
               'I am a full-stack developer specializing in React, Tailwind CSS, and Django. I build modern, responsive websites and web applications with clean designs and smooth user experiences. From frontend styling to backend logic, I ensure everything works seamlessly. I also offer UI/UX design services, focusing on user-friendly interfaces and efficient workflows.'}
            </p>

            {/* Let us talk button */}
            <Link
              to={`/${username}/contact`}
              className="inline-block mt-8 px-8 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl"
            >
              Let us talk
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioAbout;

