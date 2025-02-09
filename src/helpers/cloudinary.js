const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImage = async (imagePath) => {
  const result = await cloudinary.uploader.upload(imagePath, {
    folder: 'contacts'
  });
  return result.secure_url;
};

module.exports = {
  uploadImage
}; 