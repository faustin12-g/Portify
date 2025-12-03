import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  EnvelopeIcon,
  XMarkIcon,
  CheckIcon,
  ArchiveBoxIcon,
  PaperAirplaneIcon,
  EyeIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const UserMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

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
      
      // Check email status
      if (response.data.email_status === 'sent') {
        toast.success('Reply sent successfully and email delivered!');
      } else if (response.data.email_status === 'failed') {
        toast.success('Reply saved, but email could not be sent. ' + (response.data.email_message || ''));
        console.warn('Email error:', response.data.email_message);
      } else {
        toast.success('Reply sent successfully');
      }
      
      setReplyText('');
      fetchMessages();
      // Update selected message
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

  const handleDelete = async (message) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      await axiosClient.delete(`/contact-messages/${message.id}/`);
      toast.success('Message deleted');
      fetchMessages();
      if (selectedMessage?.id === message.id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      toast.error('Error deleting message');
    }
  };

  const filteredMessages = statusFilter === 'all' 
    ? messages 
    : messages.filter(msg => msg.status === statusFilter);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Messages
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and reply to messages sent to your portfolio
        </p>
      </div>

      {/* Status Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {['all', 'new', 'read', 'replied', 'archived'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} ({status === 'all' ? messages.length : messages.filter(m => m.status === status).length})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-4">
          {filteredMessages.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow text-center">
              <EnvelopeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No messages found</p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => {
                  setSelectedMessage(message);
                  if (message.status === 'new') {
                    handleMarkRead(message);
                  }
                }}
                className={`p-4 rounded-lg shadow cursor-pointer transition-all ${
                  selectedMessage?.id === message.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500'
                    : 'bg-white dark:bg-gray-800 hover:shadow-lg'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {message.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {message.email}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(message.status)}`}>
                    {message.status}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-2">
                  {message.message}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(message.created_at)}
                </p>
              </motion.div>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedMessage.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">{selectedMessage.email}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    {formatDate(selectedMessage.created_at)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleMarkRead(selectedMessage)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Mark as read"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleArchive(selectedMessage)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Archive"
                  >
                    <ArchiveBoxIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    title="Delete"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Message:</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>

              {selectedMessage.reply && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h3 className="font-semibold text-green-900 dark:text-green-200 mb-2">
                    Your Reply:
                  </h3>
                  <p className="text-green-800 dark:text-green-300 whitespace-pre-wrap">
                    {selectedMessage.reply}
                  </p>
                  {selectedMessage.replied_at && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                      Replied on {formatDate(selectedMessage.replied_at)}
                    </p>
                  )}
                </div>
              )}

              {!selectedMessage.reply && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Reply:</h3>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white mb-4"
                    placeholder="Type your reply here..."
                  />
                  <button
                    onClick={handleReply}
                    disabled={replying || !replyText.trim()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                    {replying ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
              <EnvelopeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Select a message to view details and reply
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserMessages;

