import bcrypt from 'bcrypt';
import Otp from '../models/otp.model.js';
import ApiError from '../utils/apiError.js';
import User from '../models/user.model.js';
import { sendMail } from '../utils/mailer.js';
import 'dotenv/config.js';
const BCRYPT_HASH = Number(process.env.BCRYPT_HASH);

User.watch().on('change', async (data) => {
    try {
        if (data.operationType === 'delete') {
            const userId = data.documentKey._id.toString();
            await Otp.deleteMany({ userId });
        }
    } catch (error) {
        console.log(
            '🚀 ~ file: otp.controller.js:16 ~ User.watch ~ error:',
            error,
        );
    }
});
const createOtp = () => {
    const randomNumber = Math.floor(Math.random() * 90000) + 10000;
    return randomNumber;
};
export const sendOtp = async (req, res, next) => {
    try {
        const email = req.body.email;
        const otp = createOtp().toString();
        const user = await User.findOne({ email });
        if (!user)
            return next(new ApiError(403, 'This email is not registered.'));
        await sendMail(
            email,
            'Code Verify of KOMIHO',
            `<p>Code of you is ${otp}</p>`,
        );
        const emailExist = await Otp.findOne({ email });
        const hashOtp = await bcrypt.hash(otp, BCRYPT_HASH);
        var result;
        if (emailExist) {
            result = await Otp.findOneAndUpdate(
                { email },
                { $set: { otp: hashOtp, used: false, userId: user._id } },
                { new: true },
            );
        } else
            result = await Otp.create({
                email,
                otp: hashOtp,
                userId: user._id,
            });

        return res.send(result);
    } catch (error) {
        next(new ApiError(error.code || 500, error.message));
    }
};
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
        const emailVerify = await Otp.findOne({ email });

        const expired = getSecondsToCurrent(emailVerify.createdAt);
        const match = await bcrypt.compare(otp, emailVerify.otp);
        if (expired > 300) return next(new ApiError(403, 'Expired code.'));
        else if (!match) return next(new ApiError(401, 'Code is not match.'));
        else if (emailVerify.used)
            return next(new ApiError(403, 'This code was used.'));
        res.json({ otp: true });
    } catch (error) {
        res.json({ otp: false, error: error.message });
    }
};
