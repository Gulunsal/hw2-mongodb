const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'doğru_cloud_name',
  api_key: 'doğru_api_key',
  api_secret: 'doğru_api_secret'
});

module.exports = cloudinary; 