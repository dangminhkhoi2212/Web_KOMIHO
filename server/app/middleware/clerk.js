import { sessions, users } from '@clerk/clerk-sdk-node';
import Cookies from 'cookies';

import ApiError from '../utils/apiError.js';
export const verifySessionClerk = async (req, res, next) => {
    try {
        const sessionId = req.body.sessionId;

        const sessionToken = req.body.sessionToken;

        const userId = req.body.userId;

        const user = await users.getUser(userId);
        const email = user.emailAddresses[0].emailAddress;
        if (email !== process.env.EMAIL_ADMIN)
            return next(new ApiError(400, 'You are not admin.'));
        if (!sessionId) return next(new ApiError(400, 'sessionId not found'));
        if (!sessionToken)
            return next(new ApiError(400, 'sessionToken not found'));
        const session = await sessions.verifySession(sessionId, sessionToken);
        next();
    } catch (error) {
        next(new ApiError(error.code || 500, error.message || error));
    }
};
