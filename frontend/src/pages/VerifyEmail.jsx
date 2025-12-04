import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, EnvelopeIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [status, setStatus] = useState('input'); // input, verifying, success, error
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      // Focus last input
      const lastInput = document.getElementById('otp-5');
      if (lastInput) lastInput.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }
    
    setLoading(true);
    setStatus('verifying');
    
    try {
      const response = await axiosClient.post('/auth/verify-email-otp/', {
        email: email,
        otp: otpCode,
      });
      
      if (response.status === 200) {
        setStatus('success');
        setMessage(response.data.message || 'Email verified successfully!');
        toast.success('Email verified successfully!');
      }
    } catch (error) {
      setStatus('error');
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.detail ||
                          'Verification failed. Please check your OTP and try again.';
      setMessage(errorMessage);
      toast.error(errorMessage);
      // Reset OTP on error
      setOtp(['', '', '', '', '', '']);
      document.getElementById('otp-0')?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    setResending(true);
    
    try {
      const response = await axiosClient.post('/auth/resend-verification-otp/', {
        email: email,
      });
      
      toast.success(response.data.message || 'Verification OTP has been sent to your email.');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.detail ||
                          'Failed to resend OTP. Please try again.';
      toast.error(errorMessage);
    } finally {
      setResending(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center"
        >
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
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <EnvelopeIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Verification Code
            </label>
            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              ))}
            </div>
          </div>

          {status === 'error' && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-700 dark:text-red-300">{message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || otp.join('').length !== 6}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resending || !email}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
            >
              <ArrowPathIcon className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
              {resending ? 'Sending...' : "Didn't receive code? Resend"}
            </button>
          </div>

          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Back to Login
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
