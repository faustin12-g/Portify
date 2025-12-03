import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axiosClient from '../api/axiosClient';
import SectionTitle from '../components/SectionTitle';
import { getImageUrl } from '../utils/imageUtils';
import { renderSkillIcon } from '../utils/skillIcons';
import { Link } from 'react-router-dom';
import {
  AcademicCapIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

const About = () => {
  const [aboutMe, setAboutMe] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projectsCount, setProjectsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aboutResponse, skillsResponse, projectsResponse] = await Promise.all([
          axiosClient.get('/about/'),
          axiosClient.get('/skills/'),
          axiosClient.get('/projects/'),
        ]);

        // Handle about response
        const aboutData = Array.isArray(aboutResponse.data) 
          ? aboutResponse.data 
          : aboutResponse.data.results || [];
        if (aboutData.length > 0) {
          setAboutMe(aboutData[0]);
        }

        // Handle skills response
        const skillsData = Array.isArray(skillsResponse.data)
          ? skillsResponse.data
          : skillsResponse.data.results || [];
        setSkills(skillsData);

        // Handle projects response
        const projectsData = Array.isArray(projectsResponse.data)
          ? projectsResponse.data
          : projectsResponse.data.results || [];
        setProjectsCount(projectsData.length);
      } catch (error) {
        console.error('Error fetching data:', error);
        setSkills([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const experienceText = aboutMe?.years_of_experience 
    ? `${aboutMe.years_of_experience}+ experience`
    : '1+ experience';
  
  const clientsText = aboutMe?.clients !== null && aboutMe?.clients !== undefined && aboutMe.clients !== ''
    ? `${aboutMe.clients}`
    : 'N/A';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Profile Image with Overlapping Shapes */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative flex justify-center lg:justify-start"
          >
            <div className="relative">
              {/* Background shapes */}
              <div className="absolute -left-8 -top-8 w-64 h-80 bg-primary-500 rounded-3xl opacity-80 blur-sm"></div>
              <div className="absolute -left-4 -top-4 w-64 h-80 bg-primary-600 rounded-3xl opacity-60"></div>
              
              {/* Profile Image */}
              {aboutMe?.profile_image ? (
                <div className="relative z-10">
                  <img
                    src={getImageUrl(aboutMe.profile_image)}
                    alt={aboutMe.name}
                    className="w-64 h-80 rounded-3xl object-cover shadow-2xl"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <div className="relative z-10 w-64 h-80 rounded-3xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center text-white text-6xl font-bold shadow-2xl">
                  {aboutMe?.name?.charAt(0) || 'D'}
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary-600 dark:text-primary-400 text-center lg:text-left">
              About Me
            </h2>

            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg"
              >
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                    <AcademicCapIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
                <h3 className="text-gray-900 dark:text-white font-semibold mb-1">Experience</h3>
                <p className="text-primary-600 dark:text-primary-400 text-sm">{experienceText}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg"
              >
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                    <UserGroupIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
                <h3 className="text-gray-900 dark:text-white font-semibold mb-1">Clients</h3>
                <p className="text-primary-600 dark:text-primary-400 text-sm">{clientsText}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg"
              >
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                    <BuildingOfficeIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
                <h3 className="text-gray-900 dark:text-white font-semibold mb-1">Projects</h3>
                <p className="text-primary-600 dark:text-primary-400 text-sm">{projectsCount} + Outstanding portfolios</p>
              </motion.div>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed"
            >
              {aboutMe?.bio || 'Passionate developer creating amazing web experiences'}
            </motion.p>

            {/* Let us talk button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex justify-center lg:justify-start"
            >
              <Link
                to="/contact"
                className="px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Let us talk
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Skills Section */}
        {skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-20"
          >
            <SectionTitle title="Skills" subtitle="Technologies I work with" center />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center text-4xl text-primary-600 dark:text-primary-400">
                    {renderSkillIcon(skill.name, 'w-16 h-16')}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {skill.name}
                  </h4>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary-400"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {skill.level}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default About;
