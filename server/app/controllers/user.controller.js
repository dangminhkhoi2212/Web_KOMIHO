import bcrypt from 'bcrypt';
import 'dotenv/config.js';

import User from '../models/user.model.js';
import Product from '../models/product.model.js';
import Feedback from '../models/feedback.model.js';
import Order from '../models/order.model.js';
import ApiError from '../utils/apiError.js';
import { sendMail } from '../utils/mailer.js';
import {
    deleteFile,
    deleteFolder,
    deleteResources,
    getFolder,
    uploadToCloudinary,
} from '../services/cloudinary.service.js';
import { checkUserExisted } from './auth.controller.js';
import {
    createAccessToken,
    createRefreshToken,
} from '../services/token.service.js';
import mongoose, { isValidObjectId } from 'mongoose';
const PROPERTIES_USER = process.env.PROPERTIES_USER;
const BCRYPT_HASH = process.env.BCRYPT_HASH;
const getUser = async (req, res, next) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.params.id);
        if (!userId) return next(new ApiError(400, 'userId not found.'));

        const aggFeedback = [
            {
                $match: {
                    sellerId: userId,
                    isFeedback: true, // If you want to include only feedback with isFeedback set to true
                },
            },
            {
                $group: {
                    _id: '$sellerId', // Group by userId
                    averageStars: { $avg: '$stars' }, // Calculate the average of stars
                },
            },
            {
                $project: {
                    averageStars: 1,
                    _id: 0,
                },
            },
        ];
        const [totalProducts, totalRatings, totalSales] = await Promise.all([
            Product.countDocuments({ userId }),
            Feedback.aggregate(aggFeedback),
            Order.countDocuments({ sellerId: userId, status: 'delivered' }),
        ]);
        const result = await User.findById(userId)
            .select(PROPERTIES_USER)
            .lean();
        res.json({
            ...result,
            totalProducts,
            totalRatings: totalRatings[0]?.averageStars.toFixed(2) || 0,
            totalSales,
        });
    } catch (error) {
        next(new ApiError(error.code || 500, error.message));
    }
};
const getAllUsers = async (req, res, next) => {
    try {
        const query = req.query;
        const limit = parseInt(query?.limit) || 30;
        const page = parseInt(query?.page) || 1;
        const skip = (page - 1) * limit;

        const textSearch = query?.textSearch;
        const agg = [
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    'avatar.url': 1,
                    phone: 1,
                    lock: 1,
                },
            },
            {
                $skip: skip,
            },
            { $limit: limit },
            { $sort: { name: 1 } },
        ];
        if (textSearch)
            if (isValidObjectId(textSearch)) {
                agg.unshift({
                    $match: {
                        _id: new mongoose.Types.ObjectId(textSearch),
                    },
                });
            } else
                agg.unshift({
                    $search: {
                        index: 'search_user',
                        text: {
                            query: textSearch,
                            path: {
                                wildcard: '*',
                            },
                            fuzzy: {},
                        },
                    },
                });
        const [users, count] = await Promise.all([
            User.aggregate(agg),
            User.estimatedDocumentCount(),
        ]);
        const countTemp = textSearch ? users.length : count;
        const pageCount = Math.ceil(countTemp / limit);
        res.send({ users, pageCount, limit, skip });
    } catch (error) {
        next(new ApiError(error.code || 500, error.message));
    }
};
const updateProfile = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const data = req.body;

        const file = req.file;

        const isUpdateAvatar = data.isUpdateAvatar;

        const oldUser = await User.findById(userId);
        if (!oldUser) return next(new ApiError(401, 'User not found.'));

        if (data.email && data.email !== oldUser.email) {
            let existed = await checkUserExisted(data.email);
            if (existed)
                return next(new ApiError(401, 'This email already exists.'));
        }
        if (data.phone && data.phone !== oldUser.phone) {
            if (data.phone.length !== 10)
                return next(new ApiError(401, 'Invalid phone number length.'));
            let existed = await checkUserExisted(data.phone);

            if (existed)
                return next(
                    new ApiError(401, 'This phone number already exists.'),
                );
        }

        if (file && isUpdateAvatar) {
            if (oldUser.avatar.public_id)
                await deleteFile(oldUser.avatar.public_id, 'image');
            const avatar = await uploadToCloudinary(
                file.path,
                'image',
                `komiho/users/${userId}/public`,
            );
            data.avatar = { public_id: avatar.public_id, url: avatar.url };
        }
        await User.findByIdAndUpdate(userId, data);
        const result = await User.findById(userId).select(PROPERTIES_USER);

        res.json(result);
    } catch (error) {
        console.log(
            '🚀 ~ file: user.controller.js:85 ~ updateProfile ~ error:',
            error,
        );
        next(new ApiError(error.code || 500, error.message));
    }
};
const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id;

        const password = req.body.password;

        const user = await User.findById(userId);
        if (!user) return next(new ApiError(404, 'User not found'));
        if (user.password) {
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                next(new ApiError(403, "Password don't match"));
                return;
            }
        }

        // delete on mongodb
        await User.findByIdAndUpdate(userId, { public: false });

        res.json({ message: `Deleted user ${userId}`, status: 'success' });
    } catch (error) {
        next(
            new ApiError(
                error.code || 500,
                error.message || error?.error?.message || 'Server error',
            ),
        );
    }
};

const updateAddress = async (req, res, next) => {
    try {
        const data = req.body;
        const userId = req.params.userId;
        if ('pickup' in data) {
            const result = await User.findByIdAndUpdate(
                userId,
                { $set: { 'address.pickup': data.pickup } },
                {
                    new: true,
                },
            ).select(PROPERTIES_USER);
            return res.send(result);
        }
        if ('store' in data) {
            const result = await User.findByIdAndUpdate(
                userId,
                { $set: { 'address.store': data.store } },
                {
                    new: true,
                },
            ).select(PROPERTIES_USER);
            return res.send(result);
        }
        return next(new ApiError(404, 'Data is empty.'));
    } catch (error) {
        next(new ApiError(error.code || 500, error.message));
    }
};
const recoverAccount = async (req, res, next) => {
    try {
        const email = req.body.email;
        console.log(
            '🚀 ~ file: user.controller.js:151 ~ recoverAccount ~ email:',
            email,
        );
        const result = await User.findOneAndUpdate(
            { email },
            { public: true },
            { new: true },
        )
            .select(PROPERTIES_USER)
            .lean();

        const accessToken = await createAccessToken(result._id);
        const refreshToken = await createRefreshToken(result._id);
        result.accessToken = accessToken;
        result.refreshToken = refreshToken;
        res.send(result);
    } catch (error) {
        next(new ApiError(error.code || 500, error.message || error));
    }
};
const toggleActive = async (req, res, next) => {
    try {
        const { userId, active } = req.query;
        if (!userId) return next(new ApiError(401, 'Don not find userId'));
        await User.findByIdAndUpdate(userId, { active });
        res.send({ ok: true, props: { userId, active } });
    } catch (error) {
        next(new ApiError(error.code || 500, error.message || error));
    }
};
const toggleLock = async (req, res, next) => {
    try {
        const { userId, lock } = req.body;
        if (!userId) return next(new ApiError(400, 'userId not found'));

        const user = await User.findById(userId);
        if (!user) return next(new ApiError(400, 'User not found'));

        await User.findByIdAndUpdate(userId, { lock });
        await sendMail(
            user.email,
            'Notice of account lockout',
            `<div>
                <h5>Your account are locked by admin</h5>
                 <p>Reason: ${lock.reason}</p>
            </div>`,
        );
        res.send({ ok: true, message: `Locked account with id = ${userId}` });
    } catch (error) {
        next(new ApiError(error.code || 500, error.message || error));
    }
};
export {
    PROPERTIES_USER,
    getAllUsers,
    getUser,
    deleteUser,
    updateProfile,
    updateAddress,
    recoverAccount,
    toggleActive,
    toggleLock,
};
