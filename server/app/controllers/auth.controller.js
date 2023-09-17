import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import ApiError from '../utils/apiError.js';
import 'dotenv/config.js';
import {
    createAccessToken,
    createRefreshToken,
} from '../services/token.service.js';
import { sendMail } from '../utils/mailer.js';

const PROPERTIES_USER = process.env.PROPERTIES_USER;

export const login = async (req, res, next) => {
    try {
        //username: phone or email
        const { username, password } = req.body;
        if (!username) {
            return next(new ApiError(401, 'Please provide phone or email.'));
        }
        const user = await User.findOne({
            $or: [{ email: username }, { phone: username }],
        });
        if (user) {
            if (!user.public) return res.json({ public: false });
            if (user.viaGoogle || !user.password)
                return next(new ApiError(403, 'You must login via Google.'));
            const match = await bcrypt.compare(password, user.password);
            if (!match)
                return next(new ApiError(401, 'Passwords do not match.'));
            if (!user.emailVerified)
                return next(
                    new ApiError(
                        401,
                        "Your account haven't been verified by email.",
                    ),
                );
            const accessToken = createAccessToken(user._id);
            const refreshToken = createRefreshToken(user._id);

            const result = await User.findByIdAndUpdate(
                user._id,
                { refreshToken },
                {
                    new: true,
                },
            )
                .lean()
                .select(PROPERTIES_USER);

            result.accessToken = accessToken;
            res.send(result);
        } else {
            next(new ApiError(401, 'User not found.'));
        }
    } catch (error) {
        console.log('🚀 ~ file: auth.controller.js:55 ~ login ~ error:', error);
        next(new ApiError(500, error.message));
    }
};
const BCRYPT_HASH = Number(process.env.BCRYPT_HASH);

export const checkUserExisted = async (data) => {
    try {
        const result = await User.findOne({
            $or: [{ email: data }, { phone: data }],
        });

        if (result) return true;
        return false;
    } catch (error) {
        next(new ApiError(error.code || 500, error.message));
    }
};
export const register = async (req, res, next) => {
    try {
        const data = req.body;

        const existedEmail = await checkUserExisted(data?.email);
        if (existedEmail) {
            return next(new ApiError(400, 'This email is existed.'));
        }
        const existedPhone = await checkUserExisted(data?.phone);
        if (existedPhone) {
            return next(new ApiError(400, 'This phone is existed.'));
        }
        const hashPassword = await bcrypt.hash(data.password, BCRYPT_HASH);

        const emailToken = await bcrypt.hash(data.email, BCRYPT_HASH);
        await sendMail(
            data.email,
            'Verify Account',
            `<div style="display: table;">
                    <div style="display: table-cell; vertical-align: middle;">
                        <div style="text-align: center;padding: 1rem;border: 1px solid;border-radius: 1rem;">
                            <h4>Welcome to KOMIHO</h4>
                            <p>
                                You have entered ${data.email} as your Email
                                Address for your account.
                            </p>
                            <p>
                                Please verify your email address by clicking on
                                the button below.
                            </p>
                            <a
                                href="${process.env.CLIENT_URL}/verify-email?email=${data.email}&emailToken=${emailToken}"
                                style="
                                        padding: 0.5rem 0.8rem;
                                        border-radius: 10px;
                                        background-color: #2954ad;
                                        color: #ffffff;
                                        text-decoration: none;
                                        display: inline-block;
                                        font-weight: 600;
                                    ">
                                Verify
                            </a>
                        </div>
                    </div>
                </div>`,
        );

        const newUser = await User.create({
            ...data,
            password: hashPassword,
        });
        const userWithoutPassword = await User.findById(newUser._id)
            .select('-password')
            .lean();

        return res.json(userWithoutPassword);
    } catch (error) {
        next(new ApiError(error.code || 500, error.message));
    }
};
