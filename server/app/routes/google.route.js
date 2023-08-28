import express from 'express';
const router = express.Router();
import { loginWithGoogle } from '../controllers/google.controller.js';
router.route('/login').post(loginWithGoogle);
export default router;
