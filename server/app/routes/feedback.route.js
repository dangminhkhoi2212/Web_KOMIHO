import express from 'express';
import {
    createFeedBack,
    getFeedback,
} from '../controllers/feedback.controller.js';
const router = express.Router();

router.route('/').post(createFeedBack).get(getFeedback);
export default router;
