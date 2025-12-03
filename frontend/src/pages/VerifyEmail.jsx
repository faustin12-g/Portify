import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('Invalid verification link');
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      // Don't encode - Django will handle it, and token_urlsafe tokens are already URL-safe
      const response = await axiosClient.get(`/auth/verify-email/${token}/`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      // Only set success if we get a 200 response
      if (response.status === 200) {
        setStatus('success');
        // Check if this is a "already used" message
        if (response.data.already_used) {
          setMessage(response.data.message || 'This verification link has already been used. If your email was successfully verified, you can proceed to login.');
        } else {
          setMessage(response.data.message || 'Email verified successfully!');
        }
      } else {
        setStatus('error');
        setMessage(response.data.error || 'Verification failed. Please try again.');
      }
    } catch (error) {
      // Check if it's a 400 but with a message about already used
      if (error.response?.status === 400 && 
          (error.response?.data?.message?.includes('already been used') || 
           error.response?.data?.error?.includes('already been used'))) {
        setStatus('success');
        setMessage(error.response?.data?.message || error.response?.data?.error || 'This verification link has already been used. If your email was successfully verified, you can proceed to login.');
      } else {
        setStatus('error');
        const errorMessage = error.response?.data?.error || 
          error.response?.data?.detail ||
          'Invalid or expired verification token. The link may have already been used or expired.';
        setMessage(errorMessage);
        console.error('Verification error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
    }
  };

  if (status === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verifying your email...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center"
      >
        {status === 'success' ? (
          <>
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Email Verified!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Go to Login
            </button>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircleIcon className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Verification Failed
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-6 text-left">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Possible reasons:</strong>
              </p>
              <ul className="text-sm text-gray-700 dark:text-gray-300 mt-2 list-disc list-inside">
                <li>The link has expired</li>
                <li>The link has already been used</li>
                <li>The link is invalid or corrupted</li>
              </ul>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/register')}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
              >
                Register Again
              </button>
              <button
                onClick={() => navigate('/login')}
                className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all"
              >
                Go to Login
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmail;

