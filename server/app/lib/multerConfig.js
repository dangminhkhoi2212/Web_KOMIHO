import multer from 'multer';
import path from 'path';
import ApiError from '../utils/apiError.js';

// Multer config
const storage = multer.diskStorage({});
const fileFilter = (req, file, cb) => {
    //use for update profile user
    if (!req.body.isUpdateAvatar) {
        return cb(null, true);
    }
    let ext = path.extname(file.originalname);
    if (
        ext !== '.mp4' &&
        ext !== '.mkv' &&
        ext !== '.jpeg' &&
        ext !== '.jpg' &&
        ext !== '.png' &&
        ext !== '.gif' &&
        ext !== '.pdf' &&
        ext !== '.docx' &&
        ext !== '.doc'
    ) {
        return cb(new ApiError(403, 'File type is not supported'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

export default upload;
