// // 2. Create a utility function to construct image URLs properly
// // frontend/src/utils/imageUtils.ts

// export const getImageUrl = (imagePath: string | null): string => {
//   if (!imagePath) {
//     // Return a default placeholder image
//     return "https://images.pexels.com/photos/28978147/pexels-photo-28978147.jpeg";
//   }

//   // If the path already includes the full URL, return as is
//   if (imagePath.startsWith("http")) {
//     return imagePath;
//   }

//   // If the path starts with '/', remove it to avoid double slash
//   const cleanPath = imagePath.startsWith("/")
//     ? imagePath.substring(1)
//     : imagePath;

//   // Construct the full URL
//   return `http://localhost:8080/${cleanPath}`;
// };

// // Alternative function for development vs production
// export const getImageUrlWithEnv = (imagePath: string | null): string => {
//   if (!imagePath) {
//     return "https://images.pexels.com/photos/28978147/pexels-photo-28978147.jpeg";
//   }

//   if (imagePath.startsWith("http")) {
//     return imagePath;
//   }

//   const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
//   const cleanPath = imagePath.startsWith("/")
//     ? imagePath.substring(1)
//     : imagePath;

//   return `${baseUrl}/${cleanPath}`;
// };
