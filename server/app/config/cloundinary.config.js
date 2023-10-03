import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
require('dotenv').config();
cloudinary.config({
    cloud_name: process.env.CLOUNDINARY_CLOUND_NAME,
    api_key: process.env.CLOUNDINARY_API_KEY,
    api_secret: process.env.CLOUNDINARY_API_SECRET,
});

const imageStorage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg', 'png', 'jpeg'],
    params: {
        folder: 'kimoho',
    },
});
const videoStorage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['mp4'],
    params: {
        folder: 'kimoho',
    },
});
const uploadCloud = {
    imageUpload: multer({
        storage: imageStorage,
    }),
    videoUpload: multer({
        storage: videoStorage,
    }),
};

export default uploadCloud;
