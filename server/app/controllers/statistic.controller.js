import mongoose from 'mongoose';
import ApiError from '../utils/apiError.js';
import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import User from '../models/user.model.js';
import {
    analysisTotalProducts,
    generateFilterMatch,
    generateGroupBy,
    generateSortStage,
    getAnalysisRevenue,
    getRevenue,
    getTopAllCustomers,
    getTopAllProducts,
    getTopAllSellers,
    getTopCustomers,
    getTopProducts,
    getTotalFavorite,
    getTotalOder,
    getTotalRating,
    getTotalRevenue,
} from '../services/statistic.service.js';
export const getAnalysisSeller = async (req, res, next) => {
    try {
        const query = req.query;
        const userId =
            query?.userId && new mongoose.Types.ObjectId(query?.userId);
        if (!userId) return next(new ApiError(400, 'userId not found'));

        const [
            revenue,
            totalOrder,
            totalFavorite,
            totalRating,
            topCustomers,
            topProducts,
        ] = await Promise.all([
            getRevenue(userId),
            getTotalOder(userId),
            getTotalFavorite(userId),
            getTotalRating(userId),
            getTopCustomers(userId),
            getTopProducts(userId),
        ]);
        res.send({
            revenue,
            totalOrder,
            totalFavorite,
            totalRating,
            topCustomers,
            topProducts,
        });
    } catch (error) {
        next(new ApiError(error.code || 500, error.message || error));
    }
};
export const getAnalysisAdmin = async (req, res, next) => {
    try {
        const [
            totalProducts,
            totalUsers,
            totalOrders,
            totalRevenue,
            analysisProduct,
            analysisRevenue,
            topAllCustomers,
            topAllSellers,
            topAllProducts,
        ] = await Promise.all([
            Product.estimatedDocumentCount(),
            User.estimatedDocumentCount(),
            Order.estimatedDocumentCount(),
            getTotalRevenue(),
            analysisTotalProducts(),
            getAnalysisRevenue(),
            getTopAllCustomers(),
            getTopAllSellers(),
            getTopAllProducts(),
        ]);
        res.send({
            totalProducts,
            totalUsers,
            totalOrders,
            totalRevenue,
            analysisProduct,
            analysisRevenue,
            topAllCustomers,
            topAllSellers,
            topAllProducts,
        });
    } catch (error) {
        next(new ApiError(error.code || 500, error.message || error));
    }
};
export const getAnalysisRevenueByFilter = async (req, res, next) => {
    try {
        const { filterYear, filterMonth, filterDay, userId, filterBy } =
            req.query;
        console.log(
            '🚀 ~ file: statistic.controller.js:98 ~ getAnalysisRevenueByFilter ~ filterYear, filterMonth, date, userId, filterBy:',
            { filterYear, filterMonth, filterDay, userId, filterBy },
        );
        if (!filterBy) return next(new ApiError(400, 'filterBy not found'));

        const agg = [];
        const dateFilter = generateFilterMatch(
            filterDay,
            filterMonth,
            filterYear,
        );
        // return res.send(dateFilter);

        if (userId) {
            agg.push({
                $match: {
                    sellerId: new mongoose.Types.ObjectId(userId),
                },
            });
        }

        agg.push(
            dateFilter,
            {
                $group: {
                    _id: generateGroupBy(filterBy),
                    total: { $sum: '$total' },
                    createdAt: { $first: '$createdAt' },
                },
            },
            generateSortStage(filterBy),
            {
                $project: {
                    _id: 1,
                    total: 1,
                    createdAt: 1,
                },
            },
        );
        const orders = await Order.aggregate(agg);

        return res.status(200).json({ orders });
    } catch (error) {
        next(new ApiError(error.code || 400, error.message || error));
    }
};
