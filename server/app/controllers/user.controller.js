import bcrypt from 'bcrypt';
import 'dotenv/config.js';

import User from '../models/user.model.js';
import ApiError from '../utils/apiError.js';
import { sendMail } from '../utils/mailer.js';
import {
    deleteFile,
    deleteFolder,
    uploadToCloudinary,
} from '../services/cloudinary.service.js';
import { checkUserExisted } from './auth.controller.js';
const PROPERTIES_USER = process.env.PROPERTIES_USER;
const BCRYPT_HASH = process.env.BCRYPT_HASH;
const getUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const result = await User.findById(userId).select(PROPERTIES_USER);
        res.json(result);
    } catch (error) {
        next(new ApiError(error.code || 500, error.message));
    }
};
const getAllUsers = async (_req, res, next) => {
    try {
        const users = await User.find({}).select(PROPERTIES_USER);
        res.send(users);
    } catch (error) {
        next(new ApiError(error.code || 500, error.message));
    }
};
const updateUser = async (req, res, next) => {
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
            data.avatar = {};
            data.avatar.public_id = avatar.public_id;
            data.avatar.url = avatar.url;
        }
        await User.findByIdAndUpdate(userId, data);
        const result = await User.findById(userId).select(PROPERTIES_USER);

        res.json(result);
    } catch (error) {
        console.log(
            '🚀 ~ file: user.controller.js:85 ~ updateUser ~ error:',
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
        if (!user) next(new ApiError(404, 'User not found'));
        const match = bcrypt.compare(password, user.password);
        if (!match) {
            next(new ApiError(403, "Password don't match"));
            return;
        }
        //delete avatar
        const avatar = user.avatar;
        await deleteFile(avatar.public_id, 'image');
        await deleteFolder(`komiho/users/${userId}`);

        //delete product

        //delete feedback

        await User.findByIdAndDelete(userId);
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
const deleteAllUsers = async (req, res, next) => {
    try {
        await User.deleteMany();
        res.json({ message: 'All uers deleted successfully' });
    } catch (error) {
        next(new ApiError(500, error.message));
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
        console.log(
            '🚀 ~ file: user.controller.js:140 ~ updateAddress ~ error:',
            error,
        );
        next(new ApiError(error.code || 500, error.message));
    }
};
export {
    PROPERTIES_USER,
    getAllUsers,
    getUser,
    deleteAllUsers,
    deleteUser,
    updateUser,
    updateAddress,
};