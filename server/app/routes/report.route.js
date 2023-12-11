import express from 'express';
const router = express.Router();
import { verifyToken } from '../middleware/verifyToken.js';
import {
    createReport,
    getReport,
    updateReport,
} from '../controllers/report.controller.js';

router
    .route('/')
    .post(verifyToken, createReport)
    .patch(verifyToken, updateReport)
    .get(verifyToken, getReport);

export default router;
