import 'dotenv/config.js';
import bcrypt from 'bcrypt';
import Otp from '../models/otp.model.js';
import ApiError from '../utils/apiError.js';
const getSecondsToCurrent = (timestamp) => {
    const currentDate = new Date();
    const targetDate = new Date(timestamp);

    // Calculate the time difference in milliseconds
    const timeDifferenceMs = targetDate - currentDate;

    // Calculate time difference in seconds
    const seconds = Math.floor(timeDifferenceMs / 1000);

    return seconds;
};
export const verifyOtp = async (req, res, next) => {
    try {
        const email = req.body.email;
        const otp = req.body.otp;
        console.log('🚀 ~ file: verifyOtp.js:21 ~ verifyOtp ~ otp:', otp);
        const emailVerify = await Otp.findOne({ email });
        const match = await bcrypt.compare(otp, emailVerify.otp);
        const expired = getSecondsToCurrent(emailVerify.createdAt);
        if (expired > 300) return next(new ApiError(403, 'Expired code.'));
        else if (!match) return next(new ApiError(403, 'Invalid code.'));
        else if (emailVerify.used)
            return next(new ApiError(403, 'This code was used.'));
        next();
    } catch (error) {
        console.log('🚀 ~ file: verifyOtp.js:30 ~ verifyOtp ~ error:', error);
        next(new ApiError(error.code || 500, error.message));
    }
};
