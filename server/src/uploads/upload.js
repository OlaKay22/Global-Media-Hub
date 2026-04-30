// src/uploads/upload.js — Multer + Cloudinary storage handler

const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Creates a Cloudinary-backed Multer storage instance.
 * @param {string} folder - The Cloudinary folder to upload into (e.g. 'sport', 'finance')
 */
function createCloudinaryStorage(folder = 'global-media-hub') {
  return new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
      folder: `global-media-hub/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      transformation: [{ width: 1200, crop: 'limit', quality: 'auto', fetch_format: 'auto' }],
      public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, '-').split('.')[0]}`,
    }),
  });
}

/**
 * File filter — only allows image types.
 */
function imageFilter(req, file, cb) {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed.'), false);
  }
}

/**
 * Creates a multer upload middleware for a specific segment folder.
 * Usage: const upload = createUploader('sport');
 *        router.post('/upload', upload.single('image'), controller.uploadImage);
 */
function createUploader(folder) {
  return multer({
    storage: createCloudinaryStorage(folder),
    fileFilter: imageFilter,
    limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB max
  });
}

module.exports = { createUploader, cloudinary };
