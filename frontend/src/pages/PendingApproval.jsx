import { motion } from 'framer-motion';
import { ClockIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const PendingApproval = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center"
      >
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mb-4">
            <ClockIcon className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Account Pending Approval
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your account is waiting for admin approval.
          </p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Once your account is approved by an administrator, you'll be able to access your dashboard and start building your portfolio.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Approval typically takes 24-48 hours.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="block w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PendingApproval;

