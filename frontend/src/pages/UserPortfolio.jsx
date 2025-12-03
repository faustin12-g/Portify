import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axiosClient from '../api/axiosClient';
import { ArrowDownIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { getImageUrl, getFileUrl } from '../utils/imageUtils';
import SectionTitle from '../components/SectionTitle';
import ProjectCard from '../components/ProjectCard';
import { renderSkillIcon } from '../utils/skillIcons';
import { renderSocialIcon } from '../utils/socialIcons';
import {
  AcademicCapIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ShareIcon,
  ClipboardIcon,
} from '@heroicons/react/24/outline';
import PortfolioNavbar from '../components/PortfolioNavbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

const UserPortfolio = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      // Skip if username matches reserved routes
      const reservedRoutes = ['register', 'login', 'verify-email-sent', 'pending-approval', 'dashboard', 'admin', 'portfolio'];
      if (reservedRoutes.includes(username)) {
        setError('Invalid portfolio URL.');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching portfolio for username:', username);
        const response = await axiosClient.get(`/portfolio/${username}/`);
        console.log('Portfolio API Response:', response);
        console.log('Portfolio data received:', response.data);
        console.log('About Me:', response.data?.about_me);
        console.log('Projects:', response.data?.projects);
        console.log('Skills:', response.data?.skills);
        console.log('Experiences:', response.data?.experiences);
        console.log('Educations:', response.data?.educations);
        console.log('Social Media:', response.data?.social_media);
        
        if (response.data) {
          // Ensure all arrays are properly set
          const portfolioData = {
            ...response.data,
            about_me: response.data.about_me || null,
            projects: response.data.projects || [],
            experiences: response.data.experiences || [],
            educations: response.data.educations || [],
            skills: response.data.skills || [],
            social_media: response.data.social_media || [],
          };
          console.log('Setting portfolio data:', portfolioData);
          setPortfolioData(portfolioData);
        } else {
          setError('No data received from server.');
        }
      } catch (error) {
        console.error('Error fetching portfolio:', error);
        console.error('Error response:', error.response);
        console.error('Error status:', error.response?.status);
        console.error('Error data:', error.response?.data);
        
        if (error.response?.status === 404) {
          setError(`Portfolio not found or not published. Username: ${username}`);
        } else if (error.response?.status === 403) {
          setError(error.response?.data?.error || 'Portfolio is not published. Please publish it from your dashboard.');
        } else if (error.response?.status === 500) {
          setError('Server error. Please check the backend logs.');
        } else {
          setError(`Failed to load portfolio: ${error.response?.data?.error || error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchPortfolio();
    }
  }, [username]);

  const sharePortfolio = (platform) => {
    const url = window.location.href;
    const title = portfolioData?.about_me?.name || 'Portfolio';
    const text = portfolioData?.about_me?.bio || 'Check out my portfolio!';

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Portfolio URL copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !portfolioData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Portfolio Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">{error || 'This portfolio does not exist or is not published.'}</p>
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

  // Safely destructure portfolio data with defaults
  const about_me = portfolioData?.about_me || null;
  const projects = portfolioData?.projects || [];
  const experiences = portfolioData?.experiences || [];
  const educations = portfolioData?.educations || [];
  const skills = portfolioData?.skills || [];
  const social_media = portfolioData?.social_media || [];
  
  // Debug logging
  console.log('Rendering portfolio with data:', {
    about_me,
    projectsCount: projects.length,
    experiencesCount: experiences.length,
    educationsCount: educations.length,
    skillsCount: skills.length,
    socialMediaCount: social_media.length,
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PortfolioNavbar logoImage={about_me?.logo_image ? getImageUrl(about_me.logo_image) : null} />
      
      {/* Hero Section */}
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
                  href="#contact"
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
              <ArrowDownIcon className="w-6 h-6 text-gray-400" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section - Show if about_me exists or if there are skills/educations to display */}
      {(about_me || skills.length > 0 || educations.length > 0) && (
        <section id="about" className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="About Me" subtitle="Get to know me" center />
            {about_me && (
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center"
                >
                  <AcademicCapIcon className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {educations.length || 0}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">Education</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center"
                >
                  <BuildingOfficeIcon className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {about_me?.years_of_experience || 0}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">Years of Experience</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center"
                >
                  <UserGroupIcon className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {about_me?.clients !== null && about_me?.clients !== undefined ? about_me.clients : 'N/A'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">Clients</p>
                </motion.div>
              </div>
            )}

            {skills.length > 0 && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                  Skills
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
                    >
                      {renderSkillIcon(skill.name, 'w-12 h-12 mx-auto mb-2')}
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {skill.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {skill.level}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="My Projects" subtitle="What I've built" center />
          {projects.length > 0 ? (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          ) : (
            <div className="mt-12 text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No projects added yet. Add projects from your dashboard to showcase your work.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Experience" subtitle="My work history" center />
          {experiences.length > 0 ? (
            <div className="mt-12 space-y-8">
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {exp.role}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400 font-semibold mt-1">
                        {exp.company}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                        {new Date(exp.start_date).toLocaleDateString()} -{' '}
                        {exp.end_date
                          ? new Date(exp.end_date).toLocaleDateString()
                          : 'Present'}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 mt-4">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="mt-12 text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No experience entries yet. Add your work experience from your dashboard.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Education" subtitle="My academic background" center />
          {educations.length > 0 ? (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              {educations.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl shadow-lg"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {edu.degree}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-semibold mt-1">
                    {edu.institution}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                    {edu.start_year} - {edu.end_year || 'Present'}
                  </p>
                  {edu.description && (
                    <p className="text-gray-700 dark:text-gray-300 mt-4">{edu.description}</p>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="mt-12 text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No education entries yet. Add your education from your dashboard.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Get In Touch" subtitle="Let's work together" center />
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Feel free to reach out if you'd like to collaborate or have any questions.
            </p>
            {social_media.length > 0 ? (
              <div className="flex justify-center gap-4 flex-wrap">
                {social_media.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow hover:scale-110"
                    title={social.platform || social.platform_name || 'Social Media'}
                  >
                    {renderSocialIcon(social.platform || social.platform_name || 'other', 'w-6 h-6')}
                  </a>
                ))}
              </div>
            ) : (
              <div className="py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No social media links added yet. Add your social media links from your dashboard.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Share Buttons - Fixed Position */}
      {portfolioData && (
        <div className="fixed bottom-8 right-8 flex flex-col gap-2 z-50">
          <button
            onClick={copyUrl}
            className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110"
            title="Copy Portfolio URL"
          >
            <ClipboardIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => sharePortfolio('facebook')}
            className="p-3 bg-blue-800 text-white rounded-full shadow-lg hover:bg-blue-900 transition-all hover:scale-110"
            title="Share on Facebook"
          >
            <ShareIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => sharePortfolio('twitter')}
            className="p-3 bg-blue-400 text-white rounded-full shadow-lg hover:bg-blue-500 transition-all hover:scale-110"
            title="Share on Twitter/X"
          >
            <ShareIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => sharePortfolio('linkedin')}
            className="p-3 bg-blue-700 text-white rounded-full shadow-lg hover:bg-blue-800 transition-all hover:scale-110"
            title="Share on LinkedIn"
          >
            <ShareIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => sharePortfolio('whatsapp')}
            className="p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110"
            title="Share on WhatsApp"
          >
            <ShareIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default UserPortfolio;

