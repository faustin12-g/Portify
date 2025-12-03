import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePortfolioData } from '../hooks/usePortfolioData';
import SectionTitle from '../components/SectionTitle';
import { renderSkillIcon } from '../utils/skillIcons';

const PortfolioSkills = () => {
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

  const skills = portfolioData?.skills || [];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 min-h-screen pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title="Skills" subtitle="Technologies I work with" center />
        {skills.length > 0 ? (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
        ) : (
          <div className="mt-12 text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No skills added yet. Add your skills from your dashboard.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PortfolioSkills;

