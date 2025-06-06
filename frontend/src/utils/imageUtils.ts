// frontend/src/utils/imageUtils.ts
// Create this new file to handle image URL construction

export const getImageUrl = (imagePath: string | null): string => {
  if (!imagePath) {
    // Return a default placeholder image
    return 'https://images.pexels.com/photos/28978147/pexels-photo-28978147.jpeg';
  }

  // If the path already includes the full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Construct the full URL with your backend server
  // Remove leading slash if present to avoid double slash
  const cleanPath = imagePath.startsWith('/')
    ? imagePath.substring(1)
    : imagePath;

  return `http://localhost:8080/${cleanPath}`;
};

// Alternative function for different environments
export const getImageUrlWithEnv = (imagePath: string | null): string => {
  if (!imagePath) {
    return 'https://images.pexels.com/photos/28978147/pexels-photo-28978147.jpeg';
  }

  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Use environment variable if available, otherwise default to localhost
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  const cleanPath = imagePath.startsWith('/')
    ? imagePath.substring(1)
    : imagePath;

  return `${baseUrl}/${cleanPath}`;
};
