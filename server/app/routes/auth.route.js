import express from 'express';
const router = express.Router();

import { verifyEmail } from '../controllers/mail.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { login, register } from '../controllers/auth.controller.js';
import { getSessionListClerk } from '../controllers/clerk.controller.js';
import { verifySessionClerk } from '../middleware/clerk.js';
router.route('/login').post(login);
router.route('/login/clerk').post(verifySessionClerk, getSessionListClerk);
router.route('/register').post(register);

router.route('/verify-email').post(verifyEmail);
export default router;
