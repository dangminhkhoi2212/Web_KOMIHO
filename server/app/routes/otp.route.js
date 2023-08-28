import express from 'express';
const router = express.Router();
import { sendOtp, verifyOtp } from '../controllers/otp.controller.js';
router.route('/sendOtp').post(sendOtp);
router.route('/verifyOtp').post(verifyOtp);
export default router;
