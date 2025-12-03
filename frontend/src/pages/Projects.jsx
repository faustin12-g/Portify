import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axiosClient from '../api/axiosClient';
import SectionTitle from '../components/SectionTitle';
import ProjectCard from '../components/ProjectCard';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axiosClient.get('/projects/');
        // Handle both array and paginated responses
        const projectsData = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title="My Projects" subtitle="What I've built" center />

        {Array.isArray(projects) && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No projects available yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;

