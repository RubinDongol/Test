import { message } from 'antd';

/**
 * Opens a file picker and returns the selected image file.
 * @returns Promise<File | null>
 */
const handleOpenPicker = (): Promise<File | null> => {
  return new Promise((resolve, reject) => {
    try {
      const inputElement = document.createElement('input');
      inputElement.type = 'file';
      inputElement.accept = 'image/jpeg,image/png,image/jpg';
      inputElement.style.display = 'none';

      inputElement.onchange = e => {
        const files = (e.target as HTMLInputElement).files;
        const imageFile = files?.[0];

        if (imageFile) {
          if (imageFile.size > 4 * 1024 * 1024) {
            message.error('File size of image must be less than 4 MB.');
            resolve(null);
          } else {
            resolve(imageFile);
          }
        } else {
          resolve(null);
        }

        inputElement.remove();
      };

      document.body.appendChild(inputElement);
      inputElement.click();
    } catch (err) {
      console.error('Image upload error:', err);
      reject(err);
    }
  });
};

export { handleOpenPicker };
