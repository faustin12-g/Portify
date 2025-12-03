import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import SectionTitle from '../components/SectionTitle';
import toast from 'react-hot-toast';
import axiosClient from '../api/axiosClient';
import { renderSocialIcon, getPlatformColor } from '../utils/socialIcons';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [contactInfo, setContactInfo] = useState(null);
  const [socialMedia, setSocialMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(true);
  const [contactInfoLoading, setContactInfoLoading] = useState(true);

  useEffect(() => {
    fetchContactInfo();
    fetchSocialMedia();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await axiosClient.get('/contact-info/');
      const contactData = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      // Get the first active contact info
      if (contactData.length > 0) {
        setContactInfo(contactData[0]);
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    } finally {
      setContactInfoLoading(false);
    }
  };

  const fetchSocialMedia = async () => {
    try {
      const response = await axiosClient.get('/social-media/');
      const socialData = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      setSocialMedia(socialData);
    } catch (error) {
      console.error('Error fetching social media:', error);
      setSocialMedia([]);
    } finally {
      setSocialLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosClient.post('/contact-messages/', formData);
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error sending message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title="Get In Touch" subtitle="Let's work together" center />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Contact Information
            </h3>
            <div className="space-y-4">
              {contactInfo?.email && (
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
                    <EnvelopeIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Email</h4>
                    <a 
                      href={`mailto:${contactInfo.email}`}
                      className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
              )}
              {contactInfo?.phone && (
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
                    <PhoneIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Phone</h4>
                    <a 
                      href={`tel:${contactInfo.phone}`}
                      className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>
              )}
              {contactInfo?.location && (
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
                    <MapPinIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Location</h4>
                    <p className="text-gray-600 dark:text-gray-400">{contactInfo.location}</p>
                  </div>
                </div>
              )}
              {!contactInfoLoading && !contactInfo && (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Contact information will be displayed here once configured.
                </p>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Social Media Section */}
        {!socialLoading && socialMedia.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16"
          >
            <SectionTitle title="Connect With Me" subtitle="Follow me on social media" center />
            <div className="flex flex-wrap justify-center gap-6 mt-12">
              {socialMedia.map((social, index) => (
                <motion.a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 ${getPlatformColor(social.platform || social.platform_name || 'other')}`}
                  title={social.platform || social.platform_name || 'Social Media'}
                >
                  {renderSocialIcon(social.platform || social.platform_name || 'other', 'w-8 h-8')}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Contact;
