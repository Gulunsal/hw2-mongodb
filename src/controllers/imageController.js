const cloudinary = require('cloudinary').v2;

// Cloudinary yapılandırması
cloudinary.config({
  cloud_name: 'gulays',
  api_key: '132177498767267',
  api_secret: 'Wc_bBsIQrJFEcn0DngZuEyp9K3M'
});

// Resim yükleme fonksiyonu
const uploadImage = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    res.status(200).json({
      status: 200,
      message: "Image uploaded successfully",
      data: result
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Failed to upload image" });
  }
};

module.exports = {
  uploadImage
}; 