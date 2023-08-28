import express from 'express';
import { refreshToken } from '../controllers/refreshToken.controller.js';
const router = express.Router();

router.route('/').post(refreshToken);

export default router;
