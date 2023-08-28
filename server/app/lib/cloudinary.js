import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';
cloudinary.config({
    cloud_name: process.env.CLOUNDINARY_CLOUND_NAME,
    api_key: process.env.CLOUNDINARY_API_KEY,
    api_secret: process.env.CLOUNDINARY_API_SECRET,
});

export default cloudinary;
