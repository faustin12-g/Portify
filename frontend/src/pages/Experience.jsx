import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axiosClient from '../api/axiosClient';
import SectionTitle from '../components/SectionTitle';
import { BriefcaseIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const Experience = () => {
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expResponse, eduResponse] = await Promise.all([
          axiosClient.get('/experience/'),
          axiosClient.get('/education/'),
        ]);
        
        // Handle both array and paginated responses
        const expData = Array.isArray(expResponse.data)
          ? expResponse.data
          : expResponse.data.results || [];
        const eduData = Array.isArray(eduResponse.data)
          ? eduResponse.data
          : eduResponse.data.results || [];
        
        setExperience(expData);
        setEducation(eduData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setExperience([]);
        setEducation([]);
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title="Experience & Education" subtitle="My journey" center />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Experience */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
              <BriefcaseIcon className="w-8 h-8 mr-3 text-primary-600 dark:text-primary-400" />
              Experience
            </h3>
            <div className="space-y-8">
              {Array.isArray(experience) && experience.length > 0 ? (
                experience.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative pl-8 border-l-2 border-primary-600 dark:border-primary-400"
                >
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-primary-600 dark:bg-primary-400 rounded-full"></div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {exp.role}
                    </h4>
                    <p className="text-primary-600 dark:text-primary-400 font-semibold mb-2">
                      {exp.company}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {exp.description}
                    </p>
                  </div>
                </motion.div>
                ))
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No experience entries yet.</p>
              )}
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
              <AcademicCapIcon className="w-8 h-8 mr-3 text-primary-600 dark:text-primary-400" />
              Education
            </h3>
            <div className="space-y-8">
              {Array.isArray(education) && education.length > 0 ? (
                education.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative pl-8 border-l-2 border-primary-600 dark:border-primary-400"
                >
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-primary-600 dark:bg-primary-400 rounded-full"></div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {edu.degree}
                    </h4>
                    <p className="text-primary-600 dark:text-primary-400 font-semibold mb-2">
                      {edu.institution}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {edu.start_year} - {edu.end_year || 'Present'}
                    </p>
                    {edu.description && (
                      <p className="text-gray-700 dark:text-gray-300">
                        {edu.description}
                      </p>
                    )}
                  </div>
                </motion.div>
                ))
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No education entries yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;

