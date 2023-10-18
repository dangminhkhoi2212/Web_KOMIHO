import mongoose from 'mongoose';
import ApiError from '../utils/apiError.js';
import Follow from '../models/follow.model.js';

const checkFollowInDB = async (userId, followerId) => {
    const checkFollow =
        (await Follow.find({
            userId,
            followings: followerId,
        }).count()) > 0;
    return checkFollow;
};
export const addFollower = async (req, res, next) => {
    try {
        const data = req.body;
        const userId = new mongoose.Types.ObjectId(data.userId) || undefined;
        const followerId =
            new mongoose.Types.ObjectId(data.followerId) || undefined;

        if (!userId || !followerId)
            return next(new ApiError(400, 'Invalid ID'));
        if (userId === followerId)
            return next(new ApiError(400, 'You cannot follow yourself'));

        const requester = await Follow.findOne({
            requester: userId,
            recipient: followerId,
        });
        const recipient = await Follow.findOne({
            requester: followerId,
            recipient: userId,
        });
        // if A don't follow B
        let result = {};
        if (!requester) {
            if (!recipient) {
                await Follow.create({
                    requester: userId,
                    recipient: followerId,
                    status: 'following',
                });
                result.message = `${userId} followed ${followerId}`;
                result.status = 'follow';
            } else {
                // if B followed A
                await Follow.create({
                    requester: userId,
                    recipient: followerId,
                    status: 'friend',
                });
                await Follow.findOneAndUpdate({
                    requester: followerId,
                    recipient: userId,
                    status: 'friend',
                });
                result.message = `${userId} and ${followerId} are friend`;
                result.status = 'friend';
            }
        } else {
            await Follow.findOneAndDelete({
                requester: userId,
                recipient: followerId,
            });
            if (recipient) {
                await Follow.findOneAndUpdate({
                    requester: followerId,
                    recipient: userId,
                    status: 'following',
                });
            }
            result.message = `${userId} unfollowed ${followerId}`;
            result.status = 'unfollowed';
        }

        res.send(result);
    } catch (error) {
        next(new ApiError(error.code || 500, error.message || error));
    }
};
export const checkFollow = async (req, res, next) => {
    try {
        const data = req.query;
        const userId = new mongoose.Types.ObjectId(data.userId) || undefined;
        const followerId =
            new mongoose.Types.ObjectId(data.followerId) || undefined;

        if (!userId || !followerId)
            return next(new ApiError(400, 'Invalid ID'));
        const check = await checkFollowInDB(userId, followerId);

        res.json({ isFollowed: check });
    } catch (error) {
        next(new ApiError(error.code || 500, error.message || error));
    }
};
export const getFollow = async (req, res, next) => {
    try {
        const userId =
            new mongoose.Types.ObjectId(req.query.userId) || undefined;
        const status = req.query.status;
        if (!userId) return next(new ApiError(400, 'userId not found'));
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 30;
        const skip = (page - 1) * limit;
        var result;
        if (status === 'followers') {
            result = await Follow.findOne({ userId })
                .select('-followings')
                .slice('followers', limit + skip)
                .populate('followers', 'name avatar')
                .lean();
        } else if (status === 'followings') {
            result = await Follow.findOne({ userId })
                .select('-followers')
                .slice('followings', limit + skip)
                .populate('followings', 'name avatar')
                .lean();
        } else result = { message: 'status undefined' };
        res.send(result);
    } catch (error) {
        next(new ApiError(error.code || 500, error.message || error));
    }
};
