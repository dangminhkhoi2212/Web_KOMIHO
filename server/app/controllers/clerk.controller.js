import User from '../models/user.model.js';
import {
    createAccessToken,
    createRefreshToken,
} from '../services/token.service.js';
import ApiError from '../utils/apiError.js';

export const getSessionListClerk = async (req, res, next) => {
    try {
        const admin = await User.findOne({
            email: process.env.EMAIL_ADMIN,
        }).lean();
        const accessToken = createAccessToken(admin._id);
        const refreshToken = createRefreshToken(admin._id);

        await User.findByIdAndUpdate(admin._id, {
            refreshToken,
        });

        res.send({ accessToken, refreshToken });
    } catch (error) {
        next(new ApiError(error.code || 500, error.message || error));
    }
};
