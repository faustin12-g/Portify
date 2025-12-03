import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Pagination from '../components/Pagination';
import {
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterApproved, setFilterApproved] = useState('all');
  const [approvingUserId, setApprovingUserId] = useState(null);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const [pagination, setPagination] = useState({
    total_users: 0,
    total_pages: 1,
    has_next: false,
    has_previous: false,
  });

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/auth/users/?page=${page}&page_size=${pageSize}`);
      
      // Handle both old format (array) and new format (paginated object)
      if (Array.isArray(response.data)) {
        setUsers(response.data);
        setPagination({
          total_users: response.data.length,
          total_pages: 1,
          has_next: false,
          has_previous: false,
        });
      } else {
        setUsers(response.data.results || []);
        setPagination({
          total_users: response.data.total_users || 0,
          total_pages: response.data.total_pages || 1,
          has_next: response.data.has_next || false,
          has_previous: response.data.has_previous || false,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error fetching users');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId, currentStatus) => {
    setApprovingUserId(userId);
    try {
      await axiosClient.patch(`/auth/users/${userId}/approval/`, {
        is_approved: !currentStatus,
      });
      toast.success(`User ${!currentStatus ? 'approved' : 'revoked'} successfully`);
      fetchUsers(); // Refetch to update the list
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error updating user status');
    } finally {
      setApprovingUserId(null);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to page 1 when page size changes
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.first_name && user.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter =
      filterApproved === 'all' ||
      (filterApproved === 'approved' && user.profile.is_approved) ||
      (filterApproved === 'pending' && !user.profile.is_approved);

    return matchesSearch && matchesFilter;
  });

  // Calculate stats from current page (for display) and total from API
  const stats = {
    total: pagination.total_users,
    approved: users.filter((u) => u.profile.is_approved).length,
    pending: users.filter((u) => !u.profile.is_approved).length,
    staff: users.filter((u) => u.is_staff).length,
    superuser: users.filter((u) => u.is_superuser).length,
  };

  // Loading skeleton will be shown in the table

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">User Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage all registered users and their accounts</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Users</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-green-50 dark:bg-green-900/20 rounded-xl shadow-lg p-4"
        >
          <p className="text-sm text-green-600 dark:text-green-400 mb-1">Approved</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.approved}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl shadow-lg p-4"
        >
          <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats.pending}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50 dark:bg-blue-900/20 rounded-xl shadow-lg p-4"
        >
          <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Staff</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.staff}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-purple-50 dark:bg-purple-900/20 rounded-xl shadow-lg p-4"
        >
          <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Superusers</p>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{stats.superuser}</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <select
            value={filterApproved}
            onChange={(e) => setFilterApproved(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-500"
          >
            <option value="all">All Users</option>
            <option value="approved">Approved Only</option>
            <option value="pending">Pending Approval</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Portfolio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                // Loading skeleton
                Array.from({ length: pageSize }).map((_, index) => (
                  <tr key={`skeleton-${index}`} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                        <div className="ml-4 space-y-2">
                          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
                          <div className="h-3 w-48 bg-gray-300 dark:bg-gray-600 rounded"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-8 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center">
                          <UserIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <Link
                            to={`/admin/users/${user.id}/profile`}
                            className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            {user.first_name && user.last_name
                              ? `${user.first_name} ${user.last_name}`
                              : user.username}
                          </Link>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                          <Link
                            to={`/admin/users/${user.id}/profile`}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            @{user.username}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.profile.is_approved
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}
                        >
                          {user.profile.is_approved ? (
                            <>
                              <CheckCircleIcon className="w-3 h-3 mr-1" />
                              Approved
                            </>
                          ) : (
                            <>
                              <XCircleIcon className="w-3 h-3 mr-1" />
                              Pending
                            </>
                          )}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.profile.email_verified
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          }`}
                        >
                          {user.profile.email_verified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.is_superuser ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          <ShieldCheckIcon className="w-3 h-3 mr-1" />
                          Superuser
                        </span>
                      ) : user.is_staff ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          <ShieldCheckIcon className="w-3 h-3 mr-1" />
                          Staff
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                          User
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.profile.portfolio_published ? (
                        <a
                          href={`/${user.profile.username_slug || user.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        >
                          View Portfolio
                        </a>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-sm">Not Published</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {new Date(user.date_joined).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/admin/users/${user.id}/profile`}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                        >
                          View Profile
                        </Link>
                        {!user.is_staff && !user.is_superuser && (
                          <button
                            onClick={() => handleApproveUser(user.id, user.profile.is_approved)}
                            disabled={approvingUserId === user.id}
                            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                              user.profile.is_approved
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-800'
                                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800'
                            }`}
                          >
                            {approvingUserId === user.id ? (
                              <>
                                <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {user.profile.is_approved ? 'Revoking...' : 'Approving...'}
                              </>
                            ) : (
                              user.profile.is_approved ? 'Revoke' : 'Approve'
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.total_pages > 0 && (
        <Pagination
          currentPage={page}
          totalPages={pagination.total_pages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          totalItems={pagination.total_users}
          loading={loading}
        />
      )}
    </div>
  );
};

export default AdminUsers;

