import Cart from '../models/cart.model.js';
import ApiError from '../utils/apiError.js';

export const addToCart = async (req, res, next) => {
    try {
        const { userId, sellerId, cartItemId } = req.body;

        const result = await Cart.findOneAndUpdate(
            { userId, sellerId },
            {
                $addToSet: { products: cartItemId },
            },
            {
                new: true,
                upsert: true,
            },
        );

        res.send({
            message: 'Add product to your cart successfully',
            ok: true,
            result,
        });
    } catch (error) {
        console.log(
            '🚀 ~ file: cart.controller.js:17 ~ create ~ error:',
            error,
        );
        next(
            new ApiError(
                error.code || 500,
                error.message || 'Can not add this cart.',
            ),
        );
    }
};
export const deleteCart = async (req, res, next) => {
    try {
        const { userId, sellerId } = req.params.query;
        const query = {};

        if (userId) {
            query.userId = userId;
        }
        if (sellerId) {
            query.sellerId;
        }
        await Cart.deleteMany(query);
        res.send({
            message: 'Delete cart successfully',
            ok: true,
            userId,
            sellerId,
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
export const getCartsByUserId = async (req, res, next) => {
    try {
        const { userId } = req.query;

        if (!userId) return next(new ApiError(401, 'userId not found.'));
        const result = await Cart.find({
            userId,
        })
            .populate({ path: 'sellerId', select: 'name avatar' })
            .populate({
                path: 'products',
                populate: {
                    path: 'productId',
                    select: 'active colors images public name',
                },
            });
        console.log(
            '🚀 ~ file: cart.controller.js:85 ~ getCartsByUserId ~ result:',
            result,
        );
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
