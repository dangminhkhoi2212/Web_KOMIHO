import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/apiError.js';
import User from '../models/user.model.js';
import { sendMail } from '../utils/mailer.js';
export const verifyEmail = async (req, res, next) => {
    try {
        const email = req.body.email;
        const emailToken = req.body.emailToken;

        const user = await User.findOne({ email }).select('-password');
        const match = await bcrypt.compare(email, emailToken);

        if (!match) return next(new ApiError(401, 'Invalid email.'));
        user.emailVerified = true;

        const accessToken = jwt.sign(
            user._id.toString(),
            process.env.ACCESS_TOKEN_SECRET,
        );
        const refreshToken = jwt.sign(
            user._id.toString(),
            process.env.REFRESH_TOKEN_SECRET,
        );
        user.refreshToken = refreshToken;

        const result = JSON.parse(
            JSON.stringify(
                await User.findByIdAndUpdate(user._id, user, {
                    new: true,
                }).select('-password '),
            ),
        );
        result.accessToken = accessToken;

        return res.send(result);
    } catch (error) {
        next(new ApiError(500, error.message));
    }
};
export const sendMailTo = async (req, res, next) => {
    try {
        const subject = req.body.subject;
        const to = req.body.to;
        const html = req.body.html;
        await sendMail(to, subject, html);
        res.json({ message: 'success' });
    } catch (error) {
        res.json({ message: 'failure', error: error.message });
    }
};
