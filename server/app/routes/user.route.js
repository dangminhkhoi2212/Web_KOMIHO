import express from 'express';
import * as userController from '../controllers/user.controller.js';
const router = express.Router();
import multer from '../lib/multerConfig.js';
import { verifyToken } from '../middleware/verifyToken.js';

router
    .route('/update/profile/:userId')
    .put(verifyToken, multer.single('avatar'), userController.updateProfile);
router
    .route('/update/address/:userId')
    .put(verifyToken, userController.updateAddress);

router
    .route('/:id')
    .get(userController.getUser)
    .post(userController.deleteUser);
router.route('/').get(userController.getAllUsers);
export default router;
