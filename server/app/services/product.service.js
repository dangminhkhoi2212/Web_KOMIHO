import mongoose, { isValidObjectId } from 'mongoose';

export const filterProducts = ({ textSearch, userId, star, percent }) => {
    const filters = [];

    if (textSearch) {
        if (isValidObjectId(textSearch)) {
            filters.push({
                $match: {
                    $or: [
                        {
                            _id: new mongoose.Types.ObjectId(textSearch),
                        },
                        {
                            userId: new mongoose.Types.ObjectId(textSearch),
                        },
                    ],
                },
            });
        } else
            filters.push({
                $search: {
                    index: 'search_product',
                    text: {
                        query: textSearch.toString(),
                        path: {
                            wildcard: '*',
                        },
                        fuzzy: {},
                    },
                },
            });
    }
    if (userId) {
        filters.push({
            $match: { userId: new mongoose.Types.ObjectId(userId) },
        });
    }
    if (percent) {
        filters.push({
            $match: { 'price.percent': { $gte: Number(percent) } },
        });
    }
    if (star) {
        filters.push({
            $match: { ratingsAverage: { $gte: Number(star) } },
        });
    }

    return filters;
};
export const sortProducts = ({ sortBy }) => {
    switch (sortBy) {
        case 'top-new':
            return { $sort: { _id: -1 } };
        case 'top-sold':
            return { $sort: { sold: -1 } };
        case 'top-views':
            return { $sort: { views: -1 } };
        case 'price-asc':
            return { $sort: { 'price.final': 1 } };
        case 'price-desc':
            return { $sort: { 'price.final': -1 } };
    }
};
