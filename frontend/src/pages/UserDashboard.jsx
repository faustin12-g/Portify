import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import {
  FolderIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  Cog6ToothIcon,
  UserIcon,
  ShareIcon,
  ArrowRightIcon,
  LinkIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    experience: 0,
    education: 0,
    skills: 0,
    about: 0,
    socialMedia: 0,
  });
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTogglingPublish, setIsTogglingPublish] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchUserProfile();
  }, []);

  const fetchStats = async () => {
    try {
      const [projects, experience, education, skills, about, socialMedia] = await Promise.all([
        axiosClient.get('/projects/'),
        axiosClient.get('/experience/'),
        axiosClient.get('/education/'),
        axiosClient.get('/skills/'),
        axiosClient.get('/about/'),
        axiosClient.get('/social-media/'),
      ]);

      const getLength = (data) => {
        if (Array.isArray(data)) return data.length;
        if (data.results) return data.results.length;
        return 0;
      };

      setStats({
        projects: getLength(projects.data),
        experience: getLength(experience.data),
        education: getLength(education.data),
        skills: getLength(skills.data),
        about: getLength(about.data),
        socialMedia: getLength(socialMedia.data),
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Error loading dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axiosClient.get('/auth/me/');
      setUserProfile(response.data);
      if (response.data.username_slug) {
        setPortfolioUrl(`${window.location.origin}/${response.data.username_slug}`);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleGeneratePortfolio = async () => {
    setIsGenerating(true);
    try {
      const response = await axiosClient.patch('/auth/profile/', {
        portfolio_published: true,
      });
      setUserProfile(response.data);
      if (response.data.username_slug) {
        setPortfolioUrl(`${window.location.origin}/${response.data.username_slug}`);
      }
      toast.success('Portfolio published successfully!');
    } catch (error) {
      toast.error('Failed to publish portfolio');
      console.error('Error publishing portfolio:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTogglePublish = async () => {
    setIsTogglingPublish(true);
    try {
      const newStatus = !userProfile?.portfolio_published;
      const response = await axiosClient.patch('/auth/profile/', {
        portfolio_published: newStatus,
      });
      setUserProfile(response.data);
      toast.success(newStatus ? 'Portfolio published!' : 'Portfolio unpublished');
    } catch (error) {
      toast.error('Failed to update portfolio status');
      console.error('Error updating portfolio:', error);
    } finally {
      setIsTogglingPublish(false);
    }
  };

  const copyPortfolioUrl = () => {
    if (portfolioUrl) {
      navigator.clipboard.writeText(portfolioUrl);
      toast.success('Portfolio URL copied to clipboard!');
    }
  };

  const statCards = [
    {
      name: 'Projects',
      count: stats.projects,
      icon: FolderIcon,
      color: 'from-blue-500 to-blue-600',
      link: '/dashboard/projects',
    },
    {
      name: 'Experience',
      count: stats.experience,
      icon: BriefcaseIcon,
      color: 'from-green-500 to-green-600',
      link: '/dashboard/experience',
    },
    {
      name: 'Education',
      count: stats.education,
      icon: AcademicCapIcon,
      color: 'from-purple-500 to-purple-600',
      link: '/dashboard/education',
    },
    {
      name: 'Skills',
      count: stats.skills,
      icon: Cog6ToothIcon,
      color: 'from-orange-500 to-orange-600',
      link: '/dashboard/skills',
    },
    {
      name: 'About Me',
      count: stats.about,
      icon: UserIcon,
      color: 'from-pink-500 to-pink-600',
      link: '/dashboard/about',
    },
    {
      name: 'Social Media',
      count: stats.socialMedia,
      icon: ShareIcon,
      color: 'from-indigo-500 to-indigo-600',
      link: '/dashboard/social-media',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your portfolio content from here
            </p>
          </div>
          {userProfile && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">Logged in as</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {userProfile.first_name && userProfile.last_name
                    ? `${userProfile.first_name} ${userProfile.last_name}`
                    : userProfile.username || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  @{userProfile.username}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {userProfile.first_name?.charAt(0) || userProfile.username?.charAt(0) || 'U'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Portfolio Status Card */}
      {userProfile && (
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Portfolio Status
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {userProfile.portfolio_published
                  ? 'Your portfolio is live and accessible to the public.'
                  : 'Generate your portfolio to make it publicly accessible.'}
              </p>
              {portfolioUrl && userProfile.portfolio_published && (
                <div className="mt-4 flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={portfolioUrl}
                    className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={copyPortfolioUrl}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <LinkIcon className="h-4 w-4" />
                    Copy
                  </button>
                  <Link
                    to={`/${userProfile.username_slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <GlobeAltIcon className="h-4 w-4" />
                    View
                  </Link>
                </div>
              )}
            </div>
            <div>
              {userProfile.portfolio_published ? (
                <button
                  onClick={handleTogglePublish}
                  disabled={isTogglingPublish}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTogglingPublish ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Unpublishing...
                    </>
                  ) : (
                    'Unpublish'
                  )}
                </button>
              ) : (
                <button
                  onClick={handleGeneratePortfolio}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Publishing...
                    </>
                  ) : (
                    'Generate Portfolio'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Overview Cards */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Dashboard Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((card, index) => (
            <motion.div
              key={card.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={card.link}
                className="block bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {card.name}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {card.count}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-lg bg-gradient-to-r ${card.color} text-white`}
                  >
                    <card.icon className="h-8 w-8" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                  Manage
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/dashboard/about"
            className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Update About Me
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Edit your profile information
            </p>
          </Link>
          <Link
            to="/dashboard/projects"
            className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Add New Project
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showcase your latest work
            </p>
          </Link>
          <Link
            to="/dashboard/skills"
            className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Manage Skills
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add or update your skills
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

