const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

require('dotenv').config();

const { API_KEY, API_SECRET, CLOUD_NAME } = process.env;

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Avatars',
        allowed_formats: ['jpeg', 'png', 'jpg'],
        transformation: [
            { gravity: 'face', height: 200, width: 200, crop: 'thumb' },
            { radius: 'max' },
            { fetch_format: 'auto' },
        ],
    },
});

const upload = multer({ storage });

module.exports = upload;
