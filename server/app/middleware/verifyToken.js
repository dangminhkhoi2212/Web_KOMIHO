import jwt from 'jsonwebtoken';
import 'dotenv/config';
import ApiError from '../utils/apiError.js';
export const verifyToken = (req, res, next) => {
    try {
        const authHeader =
            req.headers['Authorization'] || req.headers.authorization;

        if (!authHeader) {
            return next(new ApiError(401, 'Authorization header is missing'));
        }

        const tokenParts = authHeader.split(' ');
        if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
            return next(new ApiError(401, 'Invalid token format'));
        }

        const accessToken = tokenParts[1];
        if (!accessToken) {
            return next(new ApiError(401, 'Token is missing'));
        }
        jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET,
            (err, decode) => {
                if (err) next(new ApiError(403, 'Invalid token'));
            },
        );
        next();
    } catch (error) {
        console.log(
            '🚀 ~ file: verifyToken.js:30 ~ verifyToken ~ error:',
            error.code,
        );
        next(new ApiError(error.code || 500, error.message));
    }
};
