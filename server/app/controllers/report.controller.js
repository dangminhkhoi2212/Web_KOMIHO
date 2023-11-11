import ApiError from '../utils/apiError.js';
import Report from '../models/report.model.js';
import mongoose from 'mongoose';
export const createReport = async (req, res, next) => {
    try {
        const { userId, productId, content } = req.body;
        if (!userId) return next(new ApiError(400, 'userId not found'));
        if (!productId) return next(new ApiError(400, 'productId not found'));
        if (!content) return next(new ApiError(400, 'content not found'));
        const result = await Report.create({
            userId,
            productId,
            content,
        });
        return res.send(result);
    } catch (error) {
        next(new ApiError(error.code || 500, error.message || error));
    }
};
export const updateReport = async (req, res, next) => {
    try {
        const { reportId, isHandle } = req.body;

        if (!reportId) return next(new ApiError(400, 'reportId not found'));
        if (!isHandle) return next(new ApiError(400, 'isHandle not found'));
        const result = await Report.findByIdAndUpdate(reportId, {
            isHandle,
        }).lean();
        res.send(result);
    } catch (error) {
        next(new ApiError(error.code || 500, error.message || error));
    }
};
export const getReport = async (req, res, next) => {
    try {
        let { reportId } = req.query;
        let result;
        if (reportId) {
            result = await Report.findById(reportId)
                .populate('userId', 'name avatar.url')
                .populate('productId', 'name images lock');
        } else {
            result = await Report.find()
                .populate('userId', 'name avatar.url')
                .populate('productId', 'name images.url lock');
        }
        res.send(result);
    } catch (error) {
        next(new ApiError(error.code || 500, error.message || error));
    }
};
