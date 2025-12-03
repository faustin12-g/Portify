import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaYoutube,
  FaWhatsapp,
  FaTelegramPlane,
  FaDiscord,
  FaReddit,
  FaPinterest,
  FaSnapchat,
  FaBehance,
  FaDribbble,
  FaMedium,
  FaTwitter,
} from 'react-icons/fa';
import {
  SiTiktok,
  SiDevdotto,
  SiCodepen,
  SiStackoverflow,
} from 'react-icons/si';
import { LinkIcon } from '@heroicons/react/24/outline';

// Default icon component
const DefaultIcon = ({ className }) => (
  <LinkIcon className={className} />
);

// Platform to icon mapping
const platformIconMap = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  twitter: FaTwitter,
  'twitter/x': FaTwitter,
  x: FaTwitter,
  linkedin: FaLinkedin,
  github: FaGithub,
  youtube: FaYoutube,
  tiktok: SiTiktok,
  whatsapp: FaWhatsapp,
  telegram: FaTelegramPlane,
  discord: FaDiscord,
  reddit: FaReddit,
  pinterest: FaPinterest,
  snapchat: FaSnapchat,
  behance: FaBehance,
  dribbble: FaDribbble,
  medium: FaMedium,
  devto: SiDevdotto,
  codepen: SiCodepen,
  stackoverflow: SiStackoverflow,
  other: DefaultIcon,
};

// Platform color mapping for hover effects
export const platformColors = {
  facebook: 'hover:bg-blue-600 hover:text-white',
  instagram: 'hover:bg-gradient-to-r hover:from-purple-600 hover:via-pink-600 hover:to-yellow-500 hover:text-white',
  twitter: 'hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black',
  'twitter/x': 'hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black',
  linkedin: 'hover:bg-blue-700 hover:text-white',
  github: 'hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900',
  youtube: 'hover:bg-red-600 hover:text-white',
  tiktok: 'hover:bg-black hover:text-white',
  whatsapp: 'hover:bg-green-500 hover:text-white',
  telegram: 'hover:bg-blue-500 hover:text-white',
  discord: 'hover:bg-indigo-600 hover:text-white',
  reddit: 'hover:bg-orange-600 hover:text-white',
  pinterest: 'hover:bg-red-600 hover:text-white',
  snapchat: 'hover:bg-yellow-400 hover:text-black',
  behance: 'hover:bg-blue-600 hover:text-white',
  dribbble: 'hover:bg-pink-500 hover:text-white',
  medium: 'hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black',
  devto: 'hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black',
  codepen: 'hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black',
  stackoverflow: 'hover:bg-orange-500 hover:text-white',
  other: 'hover:bg-primary-600 hover:text-white',
};

/**
 * Get icon component for a platform
 * @param {string} platform - The platform name
 * @returns {React.Component} Icon component
 */
export const getSocialIcon = (platform) => {
  if (!platform) return DefaultIcon;
  
  const normalizedPlatform = platform.toLowerCase().trim();
  
  // Direct match
  if (platformIconMap[normalizedPlatform]) {
    return platformIconMap[normalizedPlatform];
  }
  
  // Partial match
  for (const [key, Icon] of Object.entries(platformIconMap)) {
    if (normalizedPlatform.includes(key) || key.includes(normalizedPlatform)) {
      return Icon;
    }
  }
  
  // Return default if no match
  return DefaultIcon;
};

/**
 * Render social icon with styling
 * @param {string} platform - The platform name
 * @param {string} className - Additional CSS classes
 * @returns {JSX.Element} Rendered icon
 */
export const renderSocialIcon = (platform, className = 'w-6 h-6') => {
  const Icon = getSocialIcon(platform);
  return <Icon className={className} />;
};

/**
 * Get platform color classes for hover effects
 * @param {string} platform - The platform name
 * @returns {string} Tailwind CSS classes
 */
export const getPlatformColor = (platform) => {
  if (!platform) return platformColors.other;
  
  const normalizedPlatform = platform.toLowerCase().trim();
  return platformColors[normalizedPlatform] || platformColors.other;
};

export default getSocialIcon;

