/**
 * Get the full image URL from Django backend
 * @param {string} imagePath - The image path from API response
 * @returns {string} Full URL to the image
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL, return it
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it starts with /media/, use it as is
  if (imagePath.startsWith('/media/')) {
    return `http://localhost:8000${imagePath}`;
  }
  
  // If it starts with / but not /media/, it might be a media path
  if (imagePath.startsWith('/')) {
    // Check if it looks like a media path (projects/, profile/, skills/, social/, cv/)
    if (imagePath.includes('projects/') || imagePath.includes('profile/') || 
        imagePath.includes('skills/') || imagePath.includes('social/') ||
        imagePath.includes('cv/')) {
      return `http://localhost:8000/media${imagePath}`;
    }
    return `http://localhost:8000${imagePath}`;
  }
  
  // Otherwise, prepend /media/
  return `http://localhost:8000/media/${imagePath}`;
};

/**
 * Get the full file URL from Django backend (for CV, documents, etc.)
 * @param {string} filePath - The file path from API response
 * @returns {string} Full URL to the file
 */
export const getFileUrl = (filePath) => {
  if (!filePath) return null;

  // If it's already a full URL, return it
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }

  // If it starts with /media/, use it as is
  if (filePath.startsWith('/media/')) {
    return `http://localhost:8000${filePath}`;
  }

  // If it starts with / but not /media/, prepend localhost
  if (filePath.startsWith('/')) {
    return `http://localhost:8000${filePath}`;
  }

  // Otherwise, prepend /media/
  return `http://localhost:8000/media/${filePath}`;
};

