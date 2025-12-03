import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  EnvelopeIcon,
  ArchiveBoxIcon,
  EyeIcon,
  TrashIcon,
  UserIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [senderFilter, setSenderFilter] = useState('');
  const [receiverFilter, setReceiverFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [readFilter, setReadFilter] = useState('all');
  
  // Search
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axiosClient.get('/contact-messages/');
      const messagesData = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      setMessages(messagesData);
    } catch (error) {
      toast.error('Error fetching messages');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      new: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      read: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      replied: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      archived: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    };
    return badges[status] || badges.new;
  };

  const handleReply = async () => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    setReplying(true);
    try {
      const response = await axiosClient.post(`/contact-messages/${selectedMessage.id}/reply/`, {
        reply: replyText,
      });
      
      if (response.data.email_status === 'sent') {
        toast.success('Reply sent successfully and email delivered!');
      } else if (response.data.email_status === 'failed') {
        toast.success('Reply saved, but email could not be sent. ' + (response.data.email_message || ''));
      } else {
        toast.success('Reply sent successfully');
      }
      
      setReplyText('');
      fetchMessages();
      setSelectedMessage(response.data);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error sending reply');
    } finally {
      setReplying(false);
    }
  };

  const handleMarkRead = async (message) => {
    try {
      await axiosClient.post(`/contact-messages/${message.id}/mark_read/`);
      toast.success('Message marked as read');
      fetchMessages();
      if (selectedMessage?.id === message.id) {
        setSelectedMessage({ ...selectedMessage, status: 'read' });
      }
    } catch (error) {
      toast.error('Error marking message as read');
    }
  };

  const handleArchive = async (message) => {
    try {
      await axiosClient.post(`/contact-messages/${message.id}/archive/`);
      toast.success('Message archived');
      fetchMessages();
      if (selectedMessage?.id === message.id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      toast.error('Error archiving message');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }
    try {
      await axiosClient.delete(`/contact-messages/${id}/`);
      toast.success('Message deleted successfully');
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      fetchMessages();
    } catch (error) {
      toast.error('Error deleting message');
    }
  };

  // Filter and search messages
  const filteredMessages = messages.filter((message) => {
    // Status filter
    if (statusFilter !== 'all' && message.status !== statusFilter) {
      return false;
    }

    // Read filter
    if (readFilter === 'read' && message.status === 'new') {
      return false;
    }
    if (readFilter === 'unread' && message.status !== 'new') {
      return false;
    }

    // Sender filter
    if (senderFilter && !message.name.toLowerCase().includes(senderFilter.toLowerCase()) &&
        !message.email.toLowerCase().includes(senderFilter.toLowerCase())) {
      return false;
    }

    // Receiver filter (portfolio owner)
    if (receiverFilter && message.user) {
      const receiverName = message.user.username || '';
      if (!receiverName.toLowerCase().includes(receiverFilter.toLowerCase())) {
        return false;
      }
    }

    // Date filter
    if (dateFilter) {
      const messageDate = new Date(message.created_at).toLocaleDateString();
      const filterDate = new Date(dateFilter).toLocaleDateString();
      if (messageDate !== filterDate) {
        return false;
      }
    }

    // Search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        message.name.toLowerCase().includes(searchLower) ||
        message.email.toLowerCase().includes(searchLower) ||
        message.message.toLowerCase().includes(searchLower) ||
        (message.user && message.user.username && message.user.username.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) {
        return false;
      }
    }

    return true;
  });

  const unreadCount = messages.filter((m) => m.status === 'new').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Messages</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage all contact messages across the platform
          </p>
        </div>
        {unreadCount > 0 && (
          <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-lg">
            {unreadCount} new message{unreadCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, content, or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-500"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>

          {/* Read Filter */}
          <select
            value={readFilter}
            onChange={(e) => setReadFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-500"
          >
            <option value="all">All Messages</option>
            <option value="read">Read Only</option>
            <option value="unread">Unread Only</option>
          </select>

          {/* Date Filter */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        {/* Additional Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Filter by sender name or email..."
              value={senderFilter}
              onChange={(e) => setSenderFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Filter by receiver (portfolio owner)..."
              value={receiverFilter}
              onChange={(e) => setReceiverFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-500"
            />
          </div>
        </div>

        {/* Clear Filters */}
        {(statusFilter !== 'all' || readFilter !== 'all' || senderFilter || receiverFilter || dateFilter || searchTerm) && (
          <button
            onClick={() => {
              setStatusFilter('all');
              setReadFilter('all');
              setSenderFilter('');
              setReceiverFilter('');
              setDateFilter('');
              setSearchTerm('');
            }}
            className="mt-4 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            Clear all filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredMessages.length} of {messages.length} messages
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
              {filteredMessages.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No messages found
                </p>
              ) : (
                filteredMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setSelectedMessage(message)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedMessage?.id === message.id
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500'
                        : 'bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {message.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{message.email}</p>
                        {message.user && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            To: {message.user.username || 'Unknown'}
                          </p>
                        )}
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(message.status)}`}
                      >
                        {message.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                      {message.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {new Date(message.created_at).toLocaleDateString()}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedMessage.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">{selectedMessage.email}</p>
                  {selectedMessage.user && (
                    <div className="flex items-center mt-2">
                      <UserIcon className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Portfolio Owner:{' '}
                      </span>
                      <Link
                        to={`/admin/users/${typeof selectedMessage.user === 'object' ? selectedMessage.user.id : selectedMessage.user}/profile`}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline ml-1"
                      >
                        {typeof selectedMessage.user === 'object' ? selectedMessage.user.username : 'Unknown'}
                      </Link>
                    </div>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    {new Date(selectedMessage.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {selectedMessage.status === 'new' && (
                    <button
                      onClick={() => handleMarkRead(selectedMessage)}
                      className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800"
                      title="Mark as read"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                  )}
                  {selectedMessage.status !== 'archived' && (
                    <button
                      onClick={() => handleArchive(selectedMessage)}
                      className="p-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-800"
                      title="Archive"
                    >
                      <ArchiveBoxIcon className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800"
                    title="Delete"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Message
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {selectedMessage.reply && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Portfolio Owner's Reply
                  </h3>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {selectedMessage.reply}
                    </p>
                    {selectedMessage.replied_at && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Replied on {new Date(selectedMessage.replied_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Admin Reply Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Reply to Message
                </h3>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="Type your reply here..."
                />
                <button
                  onClick={handleReply}
                  disabled={replying || !replyText.trim()}
                  className="mt-4 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                  <span>{replying ? 'Sending...' : 'Send Reply'}</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
              <EnvelopeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
