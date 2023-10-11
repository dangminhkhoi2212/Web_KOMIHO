import mongoose from 'mongoose';
import Cart from '../models/cart.model.js';
import ApiError from '../utils/apiError.js';

export const addToCart = async (req, res, next) => {
    try {
        const { userId, sellerId, productId, select } = req.body;

        const result = await Cart.findOneAndUpdate(
            {
                userId,
                sellerId,
                productId,
                'select.color': select.color,
                'select.size': select.size,
            },
            {
                userId,
                sellerId,
                productId,
                productId,
                select,
            },
            {
                new: true,
                upsert: true,
            },
        );
        const cartLength = await Cart.countDocuments({ userId });
        res.send({
            message: 'Add product to your cart successfully',
            ok: true,
            result,
            cartLength,
        });
    } catch (error) {
        next(
            new ApiError(
                error.code || 500,
                error.message || 'Can not add this cart.',
            ),
        );
    }
};
export const updateCart = async (req, res, next) => {
    try {
        const { cartId, select } = req.body;
        if (!cartId) return next(new ApiError(400, 'CartId not found'));
        const result = await Cart.findByIdAndUpdate(
            cartId,
            { select },
            { new: true },
        );
        res.send({ ok: true, result });
    } catch (error) {
        next(
            new ApiError(
                error.code || 500,
                error.message || error || 'Can not update this cart.',
            ),
        );
    }
};
export const deleteCart = async (req, res, next) => {
    try {
        const { userId, cartIds } = req.query;
        if (!userId) return next(new ApiError(400, 'userId not found'));

        await Cart.deleteMany({ _id: { $in: JSON.parse(cartIds) } });
        const cartLength = await Cart.countDocuments({ userId });
        return res.send({
            ok: true,
            msg: `Deleted cart with ids ${cartIds} `,
            cartLength,
        });
    } catch (error) {
        next(
            new ApiError(
                error.code || 500,
                error.message || 'Can not delete this cart.',
            ),
        );
    }
};
export const getCart = async (req, res, next) => {
    try {
        const { userId, getLength, cartIds } = req.query;

        if (!userId) return next(new ApiError(401, 'userId not found.'));
        if (getLength === 'yes') {
            const cartLength = await Cart.countDocuments({ userId });
            return res.send({ cartLength });
        }
        var agg = [];
        agg.push({
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
            },
        });

        if (cartIds) {
            const cartIdsTemp = JSON.parse(cartIds).map(
                (id) => new mongoose.Types.ObjectId(id),
            );

            if (cartIdsTemp?.length) {
                agg.push({
                    $match: { _id: { $in: cartIdsTemp } },
                });
            }
        }
        agg.push({
            $group: {
                _id: {
                    userId: '$userId',
                    sellerId: '$sellerId',
                },
                products: {
                    $push: {
                        _id: '$_id',
                        productId: '$productId',
                        select: '$select',
                    },
                },
            },
        });
        agg = [...agg, { $sort: { _id: 1 } }];
        const result_agg = await Cart.aggregate(agg);
        const result = await Cart.populate(result_agg, [
            {
                path: '_id.sellerId',
                model: 'User',
                select: 'name avatar address',
            },
            {
                path: 'products.productId',
                model: 'Product',
                select: '-description',
                populate: {
                    path: 'userId',
                    model: 'User',
                    select: 'name avatar',
                },
            },
        ]);
        res.send(result);
    } catch (error) {
        next(
            new ApiError(
                error.code || 500,
                error.message || error || 'Can not delete this cart.',
            ),
        );
    }
};
