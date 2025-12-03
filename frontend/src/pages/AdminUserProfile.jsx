import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  UserIcon,
  FolderIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  Cog6ToothIcon,
  ShareIcon,
  EnvelopeIcon,
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { getImageUrl } from '../utils/imageUtils';

const AdminUserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const response = await axiosClient.get(`/auth/users/${userId}/profile/`);
      setUserData(response.data);
    } catch (error) {
      toast.error('Error fetching user profile');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }

    try {
      // Map type names to API endpoints
      const endpointMap = {
        'about': 'about',
        'project': 'projects',
        'experience': 'experience',
        'education': 'education',
        'skill': 'skills',
        'social': 'social-media',
      };
      
      const endpoint = endpointMap[type] || type;
      await axiosClient.delete(`/${endpoint}/${id}/`);
      toast.success(`${type} deleted successfully`);
      fetchUserProfile();
    } catch (error) {
      toast.error(`Error deleting ${type}`);
    }
  };

  const handleUpdate = (type, item) => {
    // Navigate to the appropriate admin page
    // The admin pages already show all items, so they can edit from there
    const endpointMap = {
      'about': '/admin/about',
      'project': '/admin/projects',
      'experience': '/admin/experience',
      'education': '/admin/education',
      'skill': '/admin/skills',
      'social': '/admin/social-media',
    };
    
    const endpoint = endpointMap[type];
    if (endpoint) {
      navigate(endpoint);
      toast.info(`Navigate to ${type} page to edit item ID ${item.id}`);
    }
  };

  const handleToggleActive = async () => {
    try {
      await axiosClient.patch(`/auth/users/${userId}/status/`, {
        is_active: !userData.is_active,
      });
      toast.success(`User ${userData.is_active ? 'deactivated' : 'activated'} successfully`);
      fetchUserProfile();
    } catch (error) {
      toast.error('Error updating user status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">User not found</p>
        <button
          onClick={() => navigate('/admin/users')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Users
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'about', name: 'About', icon: UserIcon, count: userData.about_me ? 1 : 0 },
    { id: 'projects', name: 'Projects', icon: FolderIcon, count: userData.projects?.length || 0 },
    { id: 'experience', name: 'Experience', icon: BriefcaseIcon, count: userData.experiences?.length || 0 },
    { id: 'education', name: 'Education', icon: AcademicCapIcon, count: userData.educations?.length || 0 },
    { id: 'skills', name: 'Skills', icon: Cog6ToothIcon, count: userData.skills?.length || 0 },
    { id: 'social', name: 'Social Media', icon: ShareIcon, count: userData.social_media?.length || 0 },
    { id: 'messages', name: 'Messages', icon: EnvelopeIcon, count: userData.messages?.length || 0 },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/users')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {userData.first_name && userData.last_name
                ? `${userData.first_name} ${userData.last_name}`
                : userData.username}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">@{userData.username}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleToggleActive}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              userData.is_active
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800'
                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800'
            }`}
          >
            {userData.is_active ? (
              <>
                <XCircleIcon className="w-5 h-5 inline mr-1" />
                Deactivate
              </>
            ) : (
              <>
                <CheckCircleIcon className="w-5 h-5 inline mr-1" />
                Activate
              </>
            )}
          </button>
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
            <p className="text-gray-900 dark:text-white font-semibold">{userData.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
            <div className="flex items-center space-x-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  userData.is_active
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}
              >
                {userData.is_active ? 'Active' : 'Inactive'}
              </span>
              {userData.profile?.is_approved && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Approved
                </span>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Joined</p>
            <p className="text-gray-900 dark:text-white">
              {new Date(userData.date_joined).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                  {tab.count > 0 && (
                    <span
                      className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                        activeTab === tab.id
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        {activeTab === 'about' && (
          <div>
            {userData.about_me ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">About Me</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdate('about', userData.about_me)}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 text-sm font-semibold flex items-center space-x-1"
                    >
                      <PencilIcon className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete('about', userData.about_me.id)}
                      className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 text-sm font-semibold flex items-center space-x-1"
                    >
                      <TrashIcon className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userData.about_me.profile_image && (
                    <img
                      src={getImageUrl(userData.about_me.profile_image)}
                      alt={userData.about_me.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {userData.about_me.name}
                    </p>
                    <p className="text-lg text-blue-600 dark:text-blue-400 mb-4">
                      {userData.about_me.title}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {userData.about_me.bio}
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Experience</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {userData.about_me.years_of_experience} years
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Clients</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {userData.about_me.clients !== null && userData.about_me.clients !== undefined
                            ? userData.about_me.clients
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No About Me information available
              </p>
            )}
          </div>
        )}

        {activeTab === 'projects' && (
          <div>
            {userData.projects && userData.projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userData.projects.map((project) => (
                  <div
                    key={project.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow relative"
                  >
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <button
                        onClick={() => handleUpdate('project', project)}
                        className="p-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete('project', project.id)}
                        className="p-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-800"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                    {project.project_image && (
                      <img
                        src={getImageUrl(project.project_image)}
                        alt={project.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">{project.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                      {project.description}
                    </p>
                    <div className="flex space-x-2">
                      {project.github_link && (
                        <a
                          href={project.github_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        >
                          GitHub
                        </a>
                      )}
                      {project.live_demo_link && (
                        <a
                          href={project.live_demo_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 dark:text-green-400 hover:underline text-sm"
                        >
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No projects available</p>
            )}
          </div>
        )}

        {activeTab === 'experience' && (
          <div>
            {userData.experiences && userData.experiences.length > 0 ? (
              <div className="space-y-4">
                {userData.experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 relative"
                  >
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <button
                        onClick={() => handleUpdate('experience', exp)}
                        className="p-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete('experience', exp.id)}
                        className="p-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-800"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{exp.role}</h4>
                        <p className="text-blue-600 dark:text-blue-400">{exp.company}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(exp.start_date).toLocaleDateString()} -{' '}
                          {exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'Present'}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mt-2">{exp.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No experience entries available
              </p>
            )}
          </div>
        )}

        {activeTab === 'education' && (
          <div>
            {userData.educations && userData.educations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userData.educations.map((edu) => (
                  <div
                    key={edu.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 relative"
                  >
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <button
                        onClick={() => handleUpdate('education', edu)}
                        className="p-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete('education', edu.id)}
                        className="p-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-800"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{edu.degree}</h4>
                    <p className="text-blue-600 dark:text-blue-400">{edu.institution}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {edu.start_year} - {edu.end_year || 'Present'}
                    </p>
                    {edu.description && (
                      <p className="text-gray-700 dark:text-gray-300 mt-2">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No education entries available
              </p>
            )}
          </div>
        )}

        {activeTab === 'skills' && (
          <div>
            {userData.skills && userData.skills.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {userData.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center relative group"
                  >
                    <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleUpdate('skill', skill)}
                        className="p-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
                        title="Edit"
                      >
                        <PencilIcon className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete('skill', skill.id)}
                        className="p-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-800"
                        title="Delete"
                      >
                        <TrashIcon className="w-3 h-3" />
                      </button>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{skill.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{skill.level}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No skills available</p>
            )}
          </div>
        )}

        {activeTab === 'social' && (
          <div>
            {userData.social_media && userData.social_media.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userData.social_media.map((social) => (
                  <div
                    key={social.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 relative"
                  >
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <button
                        onClick={() => handleUpdate('social', social)}
                        className="p-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete('social', social.id)}
                        className="p-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-800"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {social.platform || social.platform_name}
                    </h4>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {social.url}
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No social media links available
              </p>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div>
            {userData.messages && userData.messages.length > 0 ? (
              <div className="space-y-4">
                {userData.messages.map((message) => (
                  <div
                    key={message.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{message.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{message.email}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          message.status === 'new'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : message.status === 'replied'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {message.status}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mt-2">{message.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {new Date(message.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No messages available
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserProfile;

