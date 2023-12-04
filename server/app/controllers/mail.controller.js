import bcrypt from 'bcrypt';
import ApiError from '../utils/apiError.js';
import User from '../models/user.model.js';
import { sendMail } from '../utils/mailer.js';

export const verifyEmail = async (req, res, next) => {
    try {
        const email = req.body.email;
        console.log(
            '🚀 ~ file: mail.controller.js:9 ~ verifyEmail ~ email:',
            email,
        );
        const emailToken = req.body.emailToken;
        console.log(
            '🚀 ~ file: mail.controller.js:11 ~ verifyEmail ~ emailToken:',
            emailToken,
        );

        const user = await User.findOne({ email });
        const match = await bcrypt.compare(email, emailToken);

        if (!match) return next(new ApiError(401, 'Invalid email.'));
        user.emailVerified = true;
        await user.save();

        return res.send({ ok: true, message: 'Verified account.' });
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
