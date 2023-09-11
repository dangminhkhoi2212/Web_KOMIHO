import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import Otp from '../models/otp.model.js';
import 'dotenv/config';
import ApiError from '../utils/apiError.js';
const BCRYPT_HASH = Number(process.env.BCRYPT_HASH);

export const updatePassword = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        console.log(
            '🚀 ~ file: resetPassword.controller.js:13 ~ updatePassword ~ password:',
            password,
        );
        const hashPassword = await bcrypt.hash(password, BCRYPT_HASH);
        await User.findOneAndUpdate({ email }, { password: hashPassword });
        await Otp.findOneAndUpdate({ email }, { used: true });
        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.log(
            '🚀 ~ file: resetPassword.controller.js:18 ~ updatePassword ~ error:',
            error,
        );
        next(new ApiError(error.code || 500, error.message));
    }
};
