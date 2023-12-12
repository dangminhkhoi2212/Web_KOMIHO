import express from 'express';
const router = express.Router();
import { verifyToken } from '../middleware/verifyToken.js';
import {
    createReport,
    getReport,
    updateReport,
} from '../controllers/report.controller.js';

router.route('/').post(createReport).patch(updateReport).get(getReport);

export default router;
