import Cart from '../models/cart.model.js';
import CartItem from '../models/cartItem.model.js';
import ApiError from '../utils/apiError.js';
export const create = async (req, res, next) => {
    try {
        const { productId, select } = req.body;
        const result = await CartItem.create({ productId, select });

        res.send(result);
    } catch (error) {
        next(
            new ApiError(
                error.code || 500,
                error.message || 'Could not create new a cart item.',
            ),
        );
    }
};
export const update = async (req, res, next) => {
    try {
        const { cartItemId } = req.params;

        const { select } = req.body;

        const result = await CartItem.findByIdAndUpdate(
            cartItemId,
            { select },
            {
                new: true,
            },
        );
        res.send(result);
    } catch (error) {
        next(
            new ApiError(
                error.code || 500,
                error.message || 'Could not update this cart item.',
            ),
        );
    }
};
export const deleteCartItem = async (req, res, next) => {
    try {
        const data = req.query;
        const cartId = data?.cartId;
        const cartItemIds = JSON.parse(data?.cartItemIds);

        if (!cartItemIds.length)
            return next(new ApiError(401, 'cartItemId not found.'));
        if (!cartId) return next(new ApiError(401, 'cartId not found.'));

        await CartItem.deleteMany({ _id: { $in: cartItemIds } });
        const result = await Cart.findByIdAndUpdate(
            cartId,
            {
                $pull: { products: { $in: cartItemIds } },
            },
            { new: true },
        );

        res.send({
            message: 'Delete successfully',
            ok: true,
            cartItemIds,
            cartId,
            result,
        });
    } catch (error) {
        next(
            new ApiError(
                error.code || 500,
                error.message || 'Could not delete this cart item.',
            ),
        );
    }
};
