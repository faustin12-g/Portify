import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';
import { getImageUrl, getFileUrl } from '../utils/imageUtils';
import { motion } from 'framer-motion';
import { PhotoIcon, XMarkIcon, DocumentArrowDownIcon, PencilIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';

const AdminAbout = () => {
  const [aboutMe, setAboutMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    profile_image: null,
    logo_image: null,
    cv_file: null,
    years_of_experience: 0,
    clients: '',
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [currentCvUrl, setCurrentCvUrl] = useState(null);
  const [currentLogoUrl, setCurrentLogoUrl] = useState(null);
  const [clearLogo, setClearLogo] = useState(false);

  useEffect(() => {
    fetchAboutMe();
  }, []);

  const fetchAboutMe = async () => {
    try {
      const response = await axiosClient.get('/about/');
      const aboutData = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      
      if (aboutData.length > 0) {
        const about = aboutData[0];
        setAboutMe(about);
        setFormData({
          name: about.name || '',
          title: about.title || '',
          bio: about.bio || '',
          profile_image: null,
          logo_image: null,
          cv_file: null,
          years_of_experience: about.years_of_experience || 0,
          clients: about.clients !== null && about.clients !== undefined ? about.clients : '',
        });
        if (about.profile_image) {
          setPreviewImage(getImageUrl(about.profile_image));
        }
        if (about.logo_image) {
          setPreviewLogo(getImageUrl(about.logo_image));
          setCurrentLogoUrl(about.logo_image);
          setClearLogo(false);
        } else {
          setPreviewLogo(null);
          setCurrentLogoUrl(null);
          setClearLogo(false);
        }
        if (about.cv_file) {
          setCurrentCvUrl(about.cv_file);
        }
      }
    } catch (error) {
      toast.error('Error fetching about me');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profile_image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, logo_image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('title', formData.title);
    data.append('bio', formData.bio);
    data.append('years_of_experience', formData.years_of_experience);
    // Only send clients if it's a valid number (not empty string or null)
    if (formData.clients !== '' && formData.clients !== null && formData.clients !== undefined) {
      data.append('clients', formData.clients);
    }
    // If clients is empty, don't send it - backend will handle it as None
    if (formData.profile_image) {
      data.append('profile_image', formData.profile_image);
    }
    if (formData.logo_image) {
      data.append('logo_image', formData.logo_image);
    }
    if (formData.cv_file) {
      data.append('cv_file', formData.cv_file);
    }

    try {
      if (aboutMe) {
        // If we need to clear the logo, send a separate JSON request first
        if (clearLogo && !formData.logo_image) {
          try {
            await axiosClient.patch(`/about/${aboutMe.id}/`, { logo_image: null }, {
              headers: { 'Content-Type': 'application/json' }
            });
          } catch (clearError) {
            console.error('Error clearing logo:', clearError);
            // Continue with the update even if clearing fails
          }
        }
        
        // Now send the main update with FormData
        await axiosClient.patch(`/about/${aboutMe.id}/`, data);
        toast.success('About me updated successfully');
      } else {
        await axiosClient.post('/about/', data);
        toast.success('About me created successfully');
      }
      setClearLogo(false);
      fetchAboutMe();
    } catch (error) {
      console.error('Full error:', error);
      console.error('Error response:', error.response?.data);
      
      // Extract error message from various possible locations
      let errorMessage = 'Error saving about me';
      if (error.response?.data) {
        if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else {
          // Collect all validation errors
          const errors = [];
          for (const [field, messages] of Object.entries(error.response.data)) {
            if (Array.isArray(messages)) {
              errors.push(`${field}: ${messages.join(', ')}`);
            } else if (typeof messages === 'string') {
              errors.push(`${field}: ${messages}`);
            }
          }
          if (errors.length > 0) {
            errorMessage = errors.join('; ');
            console.error('Validation errors:', errors);
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          } else {
            // Try to get first error from any field
            const firstError = Object.values(error.response.data)[0];
            if (Array.isArray(firstError)) {
              errorMessage = firstError[0];
            } else if (typeof firstError === 'string') {
              errorMessage = firstError;
            }
          }
        }
      }
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    if (aboutMe) {
      setFormData({
        name: aboutMe.name || '',
        title: aboutMe.title || '',
        bio: aboutMe.bio || '',
        profile_image: null,
        logo_image: null,
        cv_file: null,
        years_of_experience: aboutMe.years_of_experience || 0,
        clients: aboutMe.clients !== null && aboutMe.clients !== undefined ? aboutMe.clients : '',
      });
      if (aboutMe.profile_image) {
        setPreviewImage(getImageUrl(aboutMe.profile_image));
      }
      if (aboutMe.logo_image) {
        setPreviewLogo(getImageUrl(aboutMe.logo_image));
        setCurrentLogoUrl(aboutMe.logo_image);
      }
      if (aboutMe.cv_file) {
        setCurrentCvUrl(aboutMe.cv_file);
      }
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: '',
      title: '',
      bio: '',
      profile_image: null,
      logo_image: null,
      cv_file: null,
      years_of_experience: 0,
      clients: '',
    });
    setPreviewImage(null);
    setPreviewLogo(null);
    setCurrentCvUrl(null);
    setCurrentLogoUrl(null);
    setClearLogo(false);
  };

  const handleSave = async (e) => {
    await handleSubmit(e);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // View Mode - Display existing data
  if (!isEditing) {
    return (
      <div>
          <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">About Me</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Your personal information and profile
            </p>
          </div>
          <div className="relative">
            <button
              onClick={handleEdit}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Edit About Me"
            >
              <EllipsisVerticalIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {aboutMe ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Images */}
              <div className="space-y-6">
                {aboutMe.logo_image && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Logo Image
                    </label>
                    <img
                      src={getImageUrl(aboutMe.logo_image)}
                      alt="Logo"
                      className="w-32 h-32 object-contain border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 p-2"
                    />
                  </div>
                )}
                {aboutMe.profile_image && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Profile Image
                    </label>
                    <img
                      src={getImageUrl(aboutMe.profile_image)}
                      alt="Profile"
                      className="w-48 h-48 rounded-full object-cover border-4 border-primary-200 dark:border-primary-800"
                    />
                  </div>
                )}
                {aboutMe.cv_file && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      CV/Resume
                    </label>
                    <a
                      href={getFileUrl(aboutMe.cv_file)}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <DocumentArrowDownIcon className="w-5 h-5" />
                      Download CV
                    </a>
                  </div>
                )}
              </div>

              {/* Right Column - Information */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <p className="text-gray-900 dark:text-white text-lg">{aboutMe.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <p className="text-gray-900 dark:text-white text-lg">{aboutMe.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{aboutMe.bio}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Years of Experience
                    </label>
                    <p className="text-gray-900 dark:text-white">{aboutMe.years_of_experience || 0}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Clients
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {aboutMe.clients !== null && aboutMe.clients !== undefined ? aboutMe.clients : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center"
          >
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              No About Me information added yet.
            </p>
            <button
              onClick={handleEdit}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Add About Me
            </button>
          </motion.div>
        )}
      </div>
    );
  }

  // Edit Mode - Show form
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">About Me</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Update your personal information and profile
          </p>
        </div>
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
      >
        <form onSubmit={handleSave} className="space-y-6">
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Logo Image (Optional)
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Upload a custom logo image (PNG, JPG, SVG, etc.). If not provided, a text-based logo will be used.
            </p>
            <div className="flex items-center space-x-6">
              <div className="relative">
                {previewLogo ? (
                  <div className="relative">
                    <img
                      src={previewLogo}
                      alt="Logo preview"
                      className="w-32 h-32 object-contain border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 p-2"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewLogo(null);
                        if (currentLogoUrl) {
                          setClearLogo(true);
                        }
                        setCurrentLogoUrl(null);
                        setFormData({ ...formData, logo_image: null });
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <PhotoIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*,.svg,.svgz"
                  onChange={handleLogoChange}
                  className="block w-full text-sm text-gray-500 dark:text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary-50 file:text-primary-700
                    hover:file:bg-primary-100
                    dark:file:bg-primary-900/30 dark:file:text-primary-300"
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Recommended: Transparent PNG or SVG, max 200x200px
                </p>
              </div>
            </div>
          </div>

          {/* Profile Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Profile Image
            </label>
            <div className="flex items-center space-x-6">
              <div className="relative">
                {previewImage ? (
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Profile preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-primary-200 dark:border-primary-800"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(null);
                        setFormData({ ...formData, profile_image: null });
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-4 border-dashed border-gray-300 dark:border-gray-600">
                    <PhotoIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 dark:text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary-50 file:text-primary-700
                    hover:file:bg-primary-100
                    dark:file:bg-primary-900/30 dark:file:text-primary-300"
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Recommended: Square image, at least 400x400px
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Professional Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white"
              placeholder="Full Stack Developer"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              required
              rows="8"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white resize-none"
              placeholder="Tell us about yourself..."
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {formData.bio.length} characters
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                min="0"
                value={formData.years_of_experience}
                onChange={(e) => setFormData({ ...formData, years_of_experience: parseInt(e.target.value) || 0 })}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white"
                placeholder="5"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Number of Clients (Optional)
              </label>
              <input
                type="number"
                min="0"
                value={formData.clients}
                onChange={(e) => setFormData({ ...formData, clients: e.target.value === '' ? '' : parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white"
                placeholder="Leave blank for N/A"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Leave blank to show "N/A" on the About page
              </p>
            </div>
          </div>

          {/* CV File Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              CV/Resume (PDF)
            </label>
            <div className="space-y-4">
              {currentCvUrl && !formData.cv_file && (
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <DocumentArrowDownIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Current CV</p>
                      <a
                        href={getFileUrl(currentCvUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        View/Download
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentCvUrl(null);
                      setFormData({ ...formData, cv_file: null });
                    }}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    title="Remove CV"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
              {formData.cv_file && (
                <div className="flex items-center justify-between p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <DocumentArrowDownIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formData.cv_file.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {(formData.cv_file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, cv_file: null });
                    }}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    title="Remove CV"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFormData({ ...formData, cv_file: file });
                    setCurrentCvUrl(null);
                  }
                }}
                className="block w-full text-sm text-gray-500 dark:text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary-50 file:text-primary-700
                  hover:file:bg-primary-100
                  dark:file:bg-primary-900/30 dark:file:text-primary-300"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Upload your CV/Resume (PDF, DOC, or DOCX format)
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : aboutMe ? 'Update About Me' : 'Create About Me'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminAbout;
