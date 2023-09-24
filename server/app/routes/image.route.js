import express from 'express';
import { deleteImages, uploadImages } from '../controllers/image.controller.js';
import multer from '../lib/multerConfig.js';

const router = express.Router();

router.route('/upload-images').post(multer.array('images'), uploadImages);
router.route('/delete-images').post(deleteImages);
export default router;
