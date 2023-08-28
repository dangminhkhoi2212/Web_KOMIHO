import ApiError from '../../utils/apiError.js';
import Admin from '../../models/user.model.js';
export const register = async (req, res, next) => {
    try {
        const data = req.body;

        if (data.phone && data.phone.length !== 10)
            return next(new ApiError(401, 'Invalid phone number length.'));
        const existed =
            (await checkUserExisted(data.phone)) ||
            (await checkUserExisted(data.email));

        if (existed) {
            next(new ApiError(400, 'This user existed.'));
        } else {
            const hashPassword = await bcrypt.hash(data.password, BCRYPT_HASH);

            const emailToken = await bcrypt.hash(data.email, BCRYPT_HASH);
            await sendMail(
                data.email,
                'Verify Account',
                `<a href="${process.env.SERVER_URL}/api/user/verifyEmail?email=${data.email}&emailToken=${emailToken}">Verify</a>`,
            );

            const newUser = await User.create({
                ...data,
                password: hashPassword,
            });
            const userWithoutPassword = await User.findById(newUser._id)
                .select('-password')
                .lean();

            return res.json(userWithoutPassword);
        }
    } catch (error) {
        next(new ApiError(error.code || 500, error.message));
    }
};
export const getAdmin = async (req, res, next) => {
    try {
        const adminId = req.params.adminId;
        const admin = await Admin.findById(adminId).select('-password');
        if (!admin) return next(new ApiError(403, "Don't find user."));
        if (admin.typeUser !== 'admin') {
            return next(new ApiError(403, "You are't admin"));
        }
        return res.send(admin);
    } catch (error) {
        next(new ApiError(error.code || 500, error.message));
    }
};
