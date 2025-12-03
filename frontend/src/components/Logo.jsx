import { motion } from 'framer-motion';
import { CodeBracketIcon } from '@heroicons/react/24/outline';

const Logo = ({ size = 'md', animated = true, className = '', logoImage = null, onClick }) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  };

  const imageSizes = {
    sm: 'h-8 max-w-24',
    md: 'h-12 max-w-40',
    lg: 'h-16 max-w-48',
    xl: 'h-20 max-w-64',
  };

  // If logo image is provided, use it
  if (logoImage) {
    const imageContent = (
      <div className={`flex items-center ${className}`} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
        <img
          src={logoImage}
          alt="Logo"
          className={`${imageSizes[size]} object-contain w-auto`}
          style={{ maxHeight: '100%' }}
          onError={(e) => {
            // Fallback to text logo if image fails to load
            e.target.style.display = 'none';
            const fallback = e.target.nextElementSibling;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        <div className="hidden items-center space-x-2">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-400 rounded-lg blur-sm opacity-50"></div>
            <div className="relative bg-gradient-to-r from-primary-600 to-primary-400 p-2 rounded-lg">
              <CodeBracketIcon className={`${iconSizes[size]} text-white`} />
            </div>
          </div>
          <span className={`${sizeClasses[size]} font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent`}>
            Portfy
          </span>
        </div>
      </div>
    );

    if (animated) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {imageContent}
        </motion.div>
      );
    }

    return imageContent;
  }

  // Default text logo
  const content = (
    <div className={`flex items-center space-x-2 ${className}`} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-400 rounded-lg blur-sm opacity-50"></div>
        <div className="relative bg-gradient-to-r from-primary-600 to-primary-400 p-2 rounded-lg">
          <CodeBracketIcon className={`${iconSizes[size]} text-white`} />
        </div>
      </div>
      <span className={`${sizeClasses[size]} font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent`}>
        Portfolio
      </span>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

export default Logo;

