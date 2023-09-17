import express from 'express';
const router = express.Router();
import { verifyToken } from '../middleware/verifyToken.js';
import { updatePassword } from '../controllers/resetPassword.controller.js';

router.route('/updatePassword').put(verifyToken, updatePassword);

export default router;
