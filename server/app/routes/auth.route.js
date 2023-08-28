import express from 'express';
const router = express.Router();

import { verifyEmail } from '../controllers/mail.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { login, register } from '../controllers/auth.controller.js';
router.route('/login').post(login);
router.route('/register').post(register);

router.route('/verify-email').post(verifyEmail);
export default router;
