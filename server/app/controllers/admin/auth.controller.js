import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../../models/user.model.js';
import ApiError from '../../utils/apiError.js';

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
            if (user.typeUser !== 'admin')
                return next(new ApiError(403, 'You are not admin.'));
            const match = await bcrypt.compare(password, user.password);
            if (!match)
                return next(new ApiError(401, 'Passwords do not match.'));
            if (!user.verifyEmail)
                return next(
                    new ApiError(
                        401,
                        "Your account haven't been verified by email.",
                    ),
                );
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
        } else {
            next(new ApiError(401, 'User not found.'));
        }
    } catch (error) {
        next(new ApiError(500, error.message));
    }
};
