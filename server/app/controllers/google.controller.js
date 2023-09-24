import 'dotenv/config.js';
import { OAuth2Client } from 'google-auth-library';
import ApiError from '../utils/apiError.js';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const PROPERTIES_USER = process.env.PROPERTIES_USER;

import {
    createAccessToken,
    createRefreshToken,
} from '../services/token.service.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const loginWithGoogle = async (req, res, next) => {
    try {
        const idToken = req.body.idToken;

        // Verify the Google ID token
        const ticket = await client.verifyIdToken({
            idToken: idToken,
        });

        const payload = ticket.getPayload();

        // Check if the user already exists
        const existingUser = await User.findOne({
            email: payload.email,
        });

        if (existingUser) {
            const accessToken = createAccessToken(existingUser._id);
            const refreshToken = createRefreshToken(existingUser._id);

            if (!existingUser.password)
                return res.json({ password: '', refreshToken, accessToken });
            if (!existingUser.public) return res.json({ public: false });
            const result = await User.findByIdAndUpdate(
                existingUser._id,
                { refreshToken },
                { new: true },
            )
                .select(PROPERTIES_USER)
                .lean();
            result.password = true;
            result.accessToken = accessToken;
            res.send(result);
            return;
        }

        // Create a new user if they don't exist in your database
        // This is the first login
        const newUser = {
            name: payload.name,
            email: payload.email,
            emailVerified: true,
            avatar: {
                url: payload.picture,
            },
        };

        const user = await User.create(newUser);
        const accessToken = createAccessToken(user._id);
        const refreshToken = createRefreshToken(user._id);
        user.refreshToken = refreshToken;

        await user.save();

        return res.json({ password: '', refreshToken, accessToken });
    } catch (error) {
        console.log(
            '🚀 ~ file: google.controller.js:57 ~ loginWithGoogle ~ error:',
            error,
        );
        next(new ApiError(error.code || 500, error.message));
    }
};
