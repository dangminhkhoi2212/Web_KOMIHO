import Favorite from '../models/favorite.model.js';
import Order from '../models/order.model.js';
import Feedback from '../models/feedback.model.js';
import User from '../models/user.model.js';
import Product from '../models/product.model.js';

const MONTH_NAME = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];
export const getRevenue = async (userId) => {
    const revenue = await Order.aggregate([
        { $match: { sellerId: userId } },
        {
            $group: {
                _id: {
                    year: {
                        $year: {
                            $dateFromString: { dateString: '$orderDate' },
                        },
                    },
                    month: {
                        $month: {
                            $dateFromString: { dateString: '$orderDate' },
                        },
                    },
                },
                totalRevenue: { $sum: '$total' },
            },
        },
        {
            $sort: { '_id.year': 1, '_id.month': 1 },
        },
    ]);
    const result = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        const year = new Date().getFullYear();
        const matchingEntry = revenue.find(
            (entry) => entry._id.month === month && entry._id.year === year,
        );
        return {
            month,
            year,
            totalRevenue: matchingEntry ? matchingEntry.totalRevenue : 0,
        };
    });
    const total = result.reduce((sum, item) => {
        return (sum += item.totalRevenue);
    }, 0);
    return { list: result, total };
};
export const getTotalOder = async (userId) => {
    const result = await Order.countDocuments({
        sellerId: userId,
        status: 'delivered',
    });
    return result;
};
export const getTotalFavorite = async (userId) => {
    const result = await Favorite.countDocuments({
        favorites: { $in: [userId] },
    });
    return result;
};
export const getTotalRating = async (userId) => {
    const result = await Feedback.aggregate([
        {
            $match: { sellerId: userId },
        },
        {
            $group: {
                _id: '$sellerId',
                avgRating: { $avg: '$stars' },
            },
        },
    ]);
    return result[0].avgRating;
};
export const getTopCustomers = async (userId) => {
    const result = await Order.aggregate([
        { $match: { sellerId: userId, status: 'delivered' } },
        {
            $group: {
                _id: '$userId',
                totalPurchases: { $sum: 1 },
                totalExpense: { $sum: '$total' },
            },
        },
        {
            $lookup: {
                from: User.collection.name,
                localField: '_id',
                foreignField: '_id',
                as: 'user',
            },
        },
        { $unwind: '$user' },
        {
            $project: {
                _id: 0,
                'user._id': 1,
                'user.name': 1,
                'user.avatar.url': 1,
                totalPurchases: 1,
                totalExpense: 1,
            },
        },
        { $limit: 10 },
        { $sort: { totalExpense: -1 } },
    ]);
    return result;
};
export const getTopProducts = async (userId) => {
    const result = await Product.aggregate([
        {
            $match: { userId },
        },
        {
            $project: {
                _id: 1,
                name: 1,
                'images.url': {
                    $cond: {
                        if: { $isArray: '$images' },
                        then: { $arrayElemAt: ['$images.url', 0] },
                        else: null,
                    },
                },
                sold: 1,
            },
        },
        { $limit: 10 },
        {
            $sort: {
                sold: -1,
            },
        },
    ]);

    return result;
};
export const analysisTotalProducts = async () => {
    let result = await Product.aggregate([
        {
            $project: {
                month: {
                    $month: '$createdAt',
                },
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
            $sort: { '_id.month': 1, '_id.year': 1 },
        },
    ]);

    result = Array.from({ length: 12 }, (_, i) => {
        const month = MONTH_NAME[i];
        const value = result.find((item) => item._id.month === i + 1);
        return {
            month: value ? MONTH_NAME[value._id.month - 1] : month,
            year: value?._id.year || new Date().getFullYear(),
            count: value?.count || 0,
        };
    });

    result = result.map((item, i) => {
        const beforeMonth = i === 0 ? item : result[i - 1];

        let grow =
            item.count === 0 && beforeMonth.count === 0
                ? 0
                : (item.count / (beforeMonth.count + item.count)) * 100;
        return {
            ...item,
            grow,
        };
    });

    return result;
};
export const getTotalRevenue = async () => {
    const result = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: '$total' },
            },
        },
        {
            $project: {
                _id: 0,
                totalRevenue: 1,
            },
        },
    ]);
    return result[0].totalRevenue;
};
export const getAnalysisRevenue = async () => {
    let result = await Order.aggregate([
        {
            $project: {
                month: { $month: '$createdAt' },
                year: { $year: '$createdAt' },
                total: 1,
            },
        },
        {
            $group: {
                _id: { month: '$month', year: '$year' },
                revenue: { $sum: '$total' },
            },
        },
    ]);

    result = Array.from({ length: 12 }, (_, i) => {
        const month = MONTH_NAME[i];
        const value = result.find((item) => item._id.month === i + 1);
        return {
            month: value ? MONTH_NAME[value._id.month - 1] : month,
            year: value?._id.year || new Date().getFullYear(),
            revenue: value?.revenue || 0,
        };
    });
    return result;
};
export const getTopAllCustomers = async (limit = 10) => {
    let result = await Order.aggregate([
        {
            $group: {
                _id: '$userId',
                totalExpense: { $sum: '$total' },
            },
        },
        {
            $lookup: {
                from: User.collection.name,
                localField: '_id',
                foreignField: '_id',
                as: 'user',
            },
        },
        {
            $project: {
                'user._id': 1,
                'user.name': 1,
                'user.avatar.url': 1,
                totalExpense: 1,
                _id: 0,
            },
        },
        {
            $unwind: '$user',
        },
        { $limit: limit },
        { $sort: { totalExpense: -1 } },
    ]);
    return result;
};
export const getTopAllSellers = async (limit = 10) => {
    let result = await Order.aggregate([
        {
            $group: {
                _id: '$sellerId',
                totalRevenue: { $sum: '$total' },
            },
        },
        {
            $lookup: {
                from: User.collection.name,
                localField: '_id',
                foreignField: '_id',
                as: 'seller',
            },
        },
        {
            $project: {
                'seller._id': 1,
                'seller.name': 1,
                'seller.avatar.url': 1,
                totalRevenue: 1,
                _id: 0,
            },
        },
        {
            $unwind: '$seller',
        },
        { $limit: limit },
        { $sort: { totalRevenue: -1 } },
    ]);
    return result;
};
export const getTopAllProducts = async (limit = 10) => {
    let result = await Product.aggregate([
        {
            $project: {
                _id: 1,
                name: 1,
                cover: {
                    $cond: {
                        if: { $isArray: '$images' },
                        then: { $arrayElemAt: ['$images.url', 0] },
                        else: null,
                    },
                },
                sold: 1,
            },
        },
        { $limit: limit },
        {
            $sort: {
                sold: -1,
            },
        },
    ]);
    return result;
};
// Helper function to generate the appropriate _id for $group stage
export const generateGroupBy = (filterBy) => {
    switch (filterBy) {
        case 'year':
            return {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' },
            };
        case 'month':
            return {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' },
                day: { $dayOfMonth: '$createdAt' },
            };
        case 'day':
            return {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' },
                day: { $dayOfMonth: '$createdAt' },
            };

        default:
            return {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' },
                day: { $dayOfMonth: '$createdAt' },
            };
    }
};

// Helper function to generate the $sort stage based on filterBy
export const generateSortStage = (filterBy) => {
    switch (filterBy) {
        case 'year':
            return { $sort: { '_id.year': 1, '_id.month': 1 } };
        case 'month':
            return { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } };
        case 'day':
            return { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } };

        default:
            return { $sort: { '_id.year': 1, '_id.month': 1 } };
    }
};
export const generateFilterMatch = (day, filterMonth, year) => {
    const dateFilter = {};

    const parsedDate = new Date(day);
    dateFilter['$match'] = {
        $expr: {
            $and: [
                {
                    $eq: [{ $year: '$createdAt' }, { $year: parsedDate }],
                },
                {
                    $eq: [{ $month: '$createdAt' }, { $month: parsedDate }],
                },
                {
                    $eq: [
                        { $dayOfMonth: '$createdAt' },
                        { $dayOfMonth: parsedDate },
                    ],
                },
            ],
        },
    };
    if (year) {
        dateFilter['$match'] = {
            $expr: {
                $eq: [{ $year: '$createdAt' }, parseInt(year)],
            },
        };
    }
    if (filterMonth?.month) {
        if (!filterMonth?.year) throw Error('year not found');
        dateFilter['$match'] = {
            $expr: {
                $and: {
                    $eq: [{ $year: '$createdAt' }, parseInt(filterMonth?.year)],
                    $eq: [
                        { $month: '$createdAt' },
                        parseInt(filterMonth?.month),
                    ],
                },
            },
        };
    }
    return dateFilter;
};
