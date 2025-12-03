import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  FolderIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  Cog6ToothIcon,
  UserIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const SystemOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axiosClient.get('/auth/system/overview/');
      setStats(response.data);
    } catch (error) {
      toast.error('Error fetching system statistics');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No statistics available</p>
      </div>
    );
  }

  const statCards = [
    {
      name: 'Total Users',
      value: stats.total_users,
      icon: UsersIcon,
      color: 'from-blue-500 to-blue-600',
      description: `${stats.active_users} active, ${stats.approved_users} approved`,
    },
    {
      name: 'Pending Approval',
      value: stats.pending_users,
      icon: XCircleIcon,
      color: 'from-yellow-500 to-yellow-600',
      description: 'Users awaiting admin approval',
    },
    {
      name: 'Staff Users',
      value: stats.staff_users,
      icon: ShieldCheckIcon,
      color: 'from-purple-500 to-purple-600',
      description: `${stats.superusers} superusers`,
    },
    {
      name: 'Total Projects',
      value: stats.total_projects,
      icon: FolderIcon,
      color: 'from-green-500 to-green-600',
      description: 'Projects across all users',
    },
    {
      name: 'Total Experience',
      value: stats.total_experiences,
      icon: BriefcaseIcon,
      color: 'from-indigo-500 to-indigo-600',
      description: 'Experience entries',
    },
    {
      name: 'Total Education',
      value: stats.total_educations,
      icon: AcademicCapIcon,
      color: 'from-pink-500 to-pink-600',
      description: 'Education entries',
    },
    {
      name: 'Total Skills',
      value: stats.total_skills,
      icon: Cog6ToothIcon,
      color: 'from-orange-500 to-orange-600',
      description: 'Skills across all users',
    },
    {
      name: 'Total About Me',
      value: stats.total_about_me,
      icon: UserIcon,
      color: 'from-teal-500 to-teal-600',
      description: 'About Me profiles',
    },
    {
      name: 'Total Messages',
      value: stats.total_messages,
      icon: EnvelopeIcon,
      color: 'from-red-500 to-red-600',
      description: `${stats.new_messages} new, ${stats.replied_messages} replied`,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">System Overview</h1>
        <p className="text-gray-600 dark:text-gray-400">Platform statistics and metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">
                {stat.name}
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Additional Stats Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Message Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">New Messages</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {stats.new_messages}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Read Messages</span>
              <span className="font-semibold text-gray-600 dark:text-gray-400">
                {stats.read_messages}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Replied Messages</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {stats.replied_messages}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">User Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Active Users</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {stats.active_users}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Approved Users</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {stats.approved_users}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Pending Approval</span>
              <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                {stats.pending_users}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SystemOverview;

