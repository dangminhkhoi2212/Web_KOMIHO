import express from 'express';
import {
    createFeedBack,
    getFeedback,
} from '../controllers/feedback.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
const router = express.Router();

router.route('/').post(verifyToken, createFeedBack).get(getFeedback);
export default router;
