import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import ApiError from '../utils/apiError.js';
import {
    createAccessToken,
    createRefreshToken,
} from '../services/token.service.js';
import 'dotenv/config.js';
export const refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) next(new ApiError(401, "Don't find refresh token"));

        console.log(
            '🚀 ~ file: refreshToken.controller.js:17 ~ refreshToken ~ refreshToken:',
            refreshToken,
        );
        const data = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        console.log(
            '🚀 ~ file: refreshToken.controller.js:18 ~ refreshToken ~ data:',
            data,
        );

        const user = await User.findById(data.userId);
        if (!user) {
            next(new ApiError(403, 'Invalid token.'));
        }
        if (user.refreshToken !== refreshToken) {
            next(new ApiError(401, "Refresh token don't match"));
        }
        const accessToken = createAccessToken(user._id);
        const newRefreshToken = createRefreshToken(user._id);
        await User.findByIdAndUpdate(user._id, {
            refreshToken: newRefreshToken,
        });

        res.json({ accessToken, refreshToken: newRefreshToken });
    } catch (error) {
        console.log(
            '🚀 ~ file: refreshToken.controller.js:36 ~ refreshToken ~ error:',
            error,
        );
        next(new ApiError(500, error.message));
    }
};
