import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePortfolioData } from '../hooks/usePortfolioData';
import SectionTitle from '../components/SectionTitle';

const PortfolioExperience = () => {
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

  const experiences = portfolioData?.experiences || [];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 min-h-screen pt-32">
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
  );
};

export default PortfolioExperience;

