import User from '../../models/user.model.js';
import ApiError from '../../utils/apiError.js';

export const statisticUserRegisterd = async (req, res, next) => {
    try {
        const result = await User.aggregate([
            {
                $project: {
                    month: { $month: '$createdAt' },
                    year: { $year: '$createdAt' },
                },
            },
            {
                $group: {
                    _id: { month: '$month', year: '$year' },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: {
                    '_id.year': 1,
                    '_id.month': 1,
                },
            },
        ]);
        res.send(result);
    } catch (error) {
        next(new ApiError(error.code || 500, error.message));
    }
};
