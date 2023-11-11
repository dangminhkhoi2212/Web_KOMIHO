import mongoose from 'mongoose';
import ApiError from '../utils/apiError.js';
import Favorite from '../models/favorite.model.js';

const check = async (userId, favoriteId) => {
    const favorite = await Favorite.findOne({
        userId,
        favorites: { $in: [favoriteId] },
    });
    return !!favorite;
};
export const toggleFavorite = async (req, res, next) => {
    try {
        const data = req.body;

        const userId = data?.userId && new mongoose.Types.ObjectId(data.userId);
        const favoriteId =
            data?.favoriteId && new mongoose.Types.ObjectId(data.favoriteId);
        if (!userId) return next(new ApiError(400, 'userId not found'));
        if (!favoriteId) return next(new ApiError(400, 'favoriteId not found'));

        const result = { ok: true };
        const favorite = await check(userId, favoriteId);

        if (favorite) {
            await Favorite.findOneAndUpdate(
                { userId },
                { $pull: { favorites: favoriteId } },
            );
            result.message = `Removed ${favoriteId} in favorite list`;
            result.status = 'removed';
        } else {
            await Favorite.findOneAndUpdate(
                { userId },
                {
                    $addToSet: { favorites: favoriteId },
                },
                {
                    upsert: true,
                },
            );
            result.message = `Added ${favoriteId} in favorite list`;
            result.status = 'add';
        }
        res.send(result);
    } catch (error) {
        next(new ApiError(error.code || 500, error.message || error));
    }
};
export const getFavorite = async (req, res, next) => {
    try {
        const query = req.query;
        const userId =
            query?.userId && new mongoose.Types.ObjectId(query?.userId);
        if (!userId) return next(new ApiError(400, 'userId not found'));

        const result = await Favorite.findOne({ userId }).populate(
            'favorites',
            'name avatar',
        );
        res.send(result.favorites);
    } catch (error) {
        next(new ApiError(error.code || 500, error.message || error));
    }
};
export const checkFavorite = async (req, res, next) => {
    try {
        const query = req.query;
        const userId =
            query?.userId && new mongoose.Types.ObjectId(query?.userId);
        const favoriteId =
            query?.favoriteId && new mongoose.Types.ObjectId(query?.favoriteId);
        if (!userId) return next(new ApiError(400, 'userId not found'));
        if (!favoriteId) return next(new ApiError(400, 'favoriteId not found'));
        const result = await check(userId, favoriteId);
        res.send({ isFavorite: result });
    } catch (error) {
        next(new ApiError(error.code || 500, error.message || error));
    }
};
