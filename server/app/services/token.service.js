import jwt from 'jsonwebtoken';
import 'dotenv/config.js';
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const createAccessToken = (data) => {
    const accessToken = jwt.sign(
        { userId: data.toString() },
        ACCESS_TOKEN_SECRET,
        {
            expiresIn: '30s',
        },
    );
    return accessToken;
};
export const createRefreshToken = (data) => {
    const refreshToken = jwt.sign(
        { userId: data.toString() },
        REFRESH_TOKEN_SECRET,
    );
    return refreshToken;
};
