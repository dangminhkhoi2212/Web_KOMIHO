import mongoose from 'mongoose';
import Order from '../models/order.model.js';
import ApiError from '../utils/apiError.js';
export const createOrder = async (req, res, next) => {
    try {
        const { orders } = req.body;
        if (!orders?.length) return next(new ApiError(400, 'Empty order.'));
        const result = await Order.insertMany(orders);
        res.send(result);
    } catch (error) {
        next(new ApiError(error.code || 500, error.message || error));
    }
};
export const getOrder = async (req, res, next) => {
    try {
        const { userId, status, sellerId } = req.query;

        var query = {};
        if (userId)
            query = {
                ...query,
                userId: new mongoose.Types.ObjectId(userId),
            };
        if (sellerId)
            query = {
                ...query,
                sellerId: new mongoose.Types.ObjectId(sellerId),
            };
        if (status) {
            query = { ...query, status };
            console.log(
                '🚀 ~ file: order.controller.js:31 ~ getOrder ~ query:',
                query,
            );
        }
        const result = await Order.find(query)
            .populate('sellerId', 'name')
            .populate('userId', 'name')
            .sort({ _id: -1 });
        res.send(result);
    } catch (error) {
        next(new ApiError(error.code || 500, error.message || error));
    }
};
export const updateOrder = async (req, res, next) => {
    try {
        const { orderId, status } = req.body;
        if (!orderId) return next(new ApiError(400, 'orderId not found.'));
        const result = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true },
        );
        res.send({ ok: true, result });
    } catch (error) {
        next(new ApiError(error.code || 500, error.message || error));
    }
};
