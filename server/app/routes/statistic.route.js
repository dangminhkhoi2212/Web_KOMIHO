import express from 'express';
import {
    getAnalysisAdmin,
    getAnalysisSeller,
    getAnalysisRevenueByFilter,
} from '../controllers/statistic.controller.js';
const router = express.Router();

router.route('/analysis-admin').get(getAnalysisAdmin);
router.route('/analysis-seller').get(getAnalysisSeller);
router.route('/analysis-revenue').get(getAnalysisRevenueByFilter);

export default router;
