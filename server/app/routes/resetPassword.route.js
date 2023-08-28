import express from 'express';
const router = express.Router();
import { verifyOtp } from '../middleware/verifyOtp.js';
import { updatePassword } from '../controllers/resetPassword.controller.js';

router.route('/updatePassword').post(verifyOtp, updatePassword);

export default router;
