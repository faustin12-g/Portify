import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePortfolioData } from '../hooks/usePortfolioData';
import SectionTitle from '../components/SectionTitle';
import ProjectCard from '../components/ProjectCard';

const PortfolioProjects = () => {
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

  const projects = portfolioData?.projects || [];

  return (
    <section className="py-20 bg-white dark:bg-gray-800 min-h-screen pt-32">
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
  );
};

export default PortfolioProjects;

