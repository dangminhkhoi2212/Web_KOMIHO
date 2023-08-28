import express from 'express';
import { sendMailTo } from '../controllers/mail.controller.js';
const router = express.Router();

router.route('/').post(sendMailTo);

export default router;
