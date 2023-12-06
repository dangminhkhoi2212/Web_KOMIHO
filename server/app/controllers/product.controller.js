import mongoose, { isValidObjectId } from 'mongoose';
import Product from '../models/product.model.js';
import Feedback from '../models/feedback.model.js';
import Order from '../models/order.model.js';
import User from '../models/user.model.js';
import {
    deleteFile,
    deleteFolder,
    deleteResources,
    getFolder,
    uploadToCloudinary,
} from '../services/cloudinary.service.js';
import ApiError from '../utils/apiError.js';
import { sendMail } from '../utils/mailer.js';
import { filterProducts, sortProducts } from '../services/product.service.js';

const deleteOnCloudinary = async (userId) => {
    // delete on cloudinary
    const pathFolder = `komiho/users`;
    const folders = await getFolder(pathFolder);
    const existedFolder = folders.some((fol) => fol.name === userId);

    if (existedFolder) {
        const folderNeedDelete = `${pathFolder}/${userId}`;
        await deleteResources(folderNeedDelete);
        await deleteFolder(folderNeedDelete);
    }
};
const addProduct = async (req, res, next) => {
    try {
        var { name, userId, price, colors, images, tags, description } =
            req.body;

        await Product.create({
            name,
            userId,
            price,
            colors,
            images,
            tags,
            description,
        });
        res.send({ message: 'Add successfully', ok: true });
    } catch (error) {
        next(
            new ApiError(
                error.code || 500,
                error.message ||
                    error.error.message ||
                    'Server error while add product.',
            ),
        );
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const { productId, userId } = req.query.productId;
        const product = await Product.findById(productId);

        if (!product) return next(new ApiError(405, 'Product not found'));

        await Product.findByIdAndDelete(productId);
        await User.findByIdAndUpdate(userId, { $inc: { productTotal: -1 } });

        res.json({
            title: `Delete product '${product.name}'`,
            status: 'success',
        });
    } catch (error) {
        next(
            new ApiError(
                error.code || 500,
                error.message || error.error.message,
            ),
        );
    }
};

const deleteManyProducts = async (req, res, next) => {
    try {
        const { ids, userId } = req.body;

        if (ids?.length > 0) {
            const manyProduct = await Product.find({ _id: { $in: ids } });
            if (manyProduct.length === 0)
                return next(new ApiError(400, "List product don't find"));

            await Product.deleteMany({ _id: { $in: ids } });
            await User.findByIdAndUpdate(userId, {
                $inc: { productTotal: -ids.length },
            });
            return res.send({
                title: `Deleted products have id ${ids}`,
                ok: true,
            });
        }
        return next(new ApiError(400, 'List products empty'));
    } catch (error) {
        next(
            new ApiError(
                error.code || 500,
                error.message || error.error.message,
            ),
        );
    }
};

const deleteAllProducts = async (req, res, next) => {
    try {
        const listProduct = req.body.listProduct;
        var message;
        if (listProduct) {
            await Promise.all(listProduct.map((id) => deleteOne(id)));
            message = 'Successfully deleted all products selected.';
        } else {
            const allProducts = await Product.find();
            await Promise.all(
                allProducts.map((product) => deleteOne(product._id)),
            );
            message = 'Successfully deleted all products';
        }
        res.json({ message });
    } catch (error) {
        next(
            new ApiError(
                error.code || 500,
                error.message || error.error.message,
            ),
        );
    }
};

const getProductsByUserId = async (req, res, next) => {
    try {
        const data = req.query;

        const userId = new mongoose.Types.ObjectId(req.params.userId);
        console.log(
            '🚀 ~ file: product.controller.js:152 ~ getProductsByUserId ~ userId:',
            userId,
        );
        if (!userId) return next(new ApiError(401, 'userId not found.'));
        const textSearch = data?.textSearch?.toString();
        const user = await User.findById(userId);
        if (!user) return next(new ApiError(404, 'User not found.'));

        const page = parseInt(data.page) || 1;
        const limit = parseInt(data.limit) || 20;

        const skip = (page - 1) * limit;

        const agg = [
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $skip: skip },
            {
                $limit: limit,
            },
        ];
        if (textSearch)
            agg.unshift({
                $search: {
                    index: 'search_product',
                    text: {
                        query: textSearch,
                        path: {
                            wildcard: '*',
                        },
                        fuzzy: {},
                    },
                },
            });
        else agg.push({ $sort: { _id: -1 } });

        // Find products with the constructed query and sort options
        const [products] = await Promise.all([Product.aggregate(agg)]);

        const pageCount = Math.ceil(
            textSearch ? products.length : user.productTotal / limit,
        );
        console.log(
            '🚀 ~ file: product.controller.js:192 ~ getProductsByUserId ~ user.productTotal:',
            user.productTotal,
            limit,
        );

        res.send({ pageCount, limit, products });
    } catch (error) {
        console.log(
            '🚀 ~ file: product.controller.js:213 ~ getProductsByUserId ~ error:',
            error,
        );
        next(
            new ApiError(
                error.code || 500,
                error.message ||
                    error.error.message ||
                    'Can not find product by useId',
            ),
        );
    }
};

export const getProductByProductId = async (req, res, next) => {
    try {
        const productId = new mongoose.Types.ObjectId(req.params.productId);
        const aggFeedback = [
            {
                $match: { productId },
            },
            {
                $group: {
                    _id: `$productId`,
                    totalRatings: { $avg: '$stars' },
                    countRatings: { $sum: 1 },
                },
            },
        ];

        const aggOrder = [
            {
                $match: {
                    'items.product.productId': productId,
                    status: 'delivered',
                },
            },
            {
                $unwind: '$items',
            },
            {
                $group: {
                    _id: '$items.product.productId',
                    countSold: { $sum: 1 },
                },
            },
        ];
        const [result, ratings, sold] = await Promise.all([
            Product.findByIdAndUpdate(
                productId,
                {
                    $inc: { views: 1 },
                },
                { new: true },
            ).lean(),
            Feedback.aggregate(aggFeedback),
            Order.aggregate(aggOrder),
        ]);
        res.send({
            ...result,
            countRatings: ratings[0]?.countRatings || 0,
            totalRatings: ratings[0]?.totalRatings.toFixed(2) || 0,
            countSold: sold[0]?.countSold || 0,
        });
    } catch (error) {
        next(
            new ApiError(
                error.code || 500,
                error.message || error.error.message || 'Can not find product',
            ),
        );
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const { name, price, store, images, colors, tags, description } =
            req.body;
        console.log(
            '🚀 ~ file: product.controller.js:281 ~ updateProduct ~ req.body:',
            req.body.name,
        );

        const result = await Product.findByIdAndUpdate(
            productId,
            {
                name,
                price,
                store,
                images,
                colors,
                tags,
                description,
            },
            { new: true },
        );
        console.log(
            '🚀 ~ file: product.controller.js:295 ~ updateProduct ~ result:',
            result,
        );

        res.send({ message: 'Update successfully.', ok: true });
    } catch (error) {
        next(
            new ApiError(
                error.code || 500,
                error.message ||
                    error.error.message ||
                    'Can not update this product',
            ),
        );
    }
};
export const toggleActive = async (req, res, next) => {
    try {
        const { productId, active } = req.query;

        if (!productId)
            return next(new ApiError(402, 'Don not find productId'));
        await Product.findByIdAndUpdate(productId, { active });
        res.send({ ok: true, props: { productId, active } });
    } catch (error) {
        next(new ApiError(error.code || 500, error.message || error));
    }
};
const getAll = async (req, res, next) => {
    try {
        const query = req.query;
        const { sortBy, star, percent, textSearch } = query;
        const userId =
            query?.userId && new mongoose.Types.ObjectId(query.userId);
        const withFullImages = query?.withFullImages === 'true' ? true : false;

        console.log(
            '🚀 ~ file: product.controller.js:322 ~ getAll ~ query:',
            query,
        );

        const page = parseInt(query?.page) || 1;
        const limit = parseInt(query?.limit) || 30;
        const skip = (page - 1) * limit;

        const projectFilter = {
            _id: 1,
            name: 1,
            userId: 1,
            price: 1,
            colors: 1,
            sold: 1,
            active: 1,
            ratingsAverage: 1,
            views: 1,
            lock: 1,
            public: 1,
        };

        if (withFullImages) {
            projectFilter.images = 1;
        } else {
            projectFilter.cover = { $arrayElemAt: ['$images.url', 0] };
        }

        const agg = [];
        agg.push(
            ...filterProducts({
                textSearch,
                userId,
                star,
                percent,
            }),
        );
        agg.push({ $project: projectFilter });
        // Count the matching documents without the skip and limit
        const countAgg = [...agg];

        countAgg.push({ $count: 'count' });
        const countResult = await Product.aggregate(countAgg);
        const count = countResult.length ? countResult[0].count : 0;

        const filterSort = sortProducts({ sortBy });
        // Add sort
        if (filterSort) agg.push(filterSort);
        // Add skip and limit for pagination
        agg.push({ $skip: skip }, { $limit: limit });

        // return res.send({ agg, query });

        // Use the aggregation pipeline to get the products
        const products = await Product.aggregate(agg);

        const pageCount = Math.ceil(count / limit);

        // Send the response
        return res.send({ products, pageCount, page, limit });
    } catch (error) {
        next(new ApiError(error.code || 500, error.message || error));
    }
};

const toggleLock = async (req, res, next) => {
    try {
        const { productId, lock } = req.body;

        if (!productId) return next(new ApiError(400, 'productId not found'));

        const product = await Product.findById(productId)
            .populate('userId', 'email')
            .lean();

        if (!product) return next(new ApiError(400, 'User not found'));

        await Product.findByIdAndUpdate(productId, { lock });
        await sendMail(
            product.userId.email,
            'Notice of product lockout',
            `
                <div>
                    <h5>Product ID: ${productId}</h5>
                    <h5>Product name: ${product.name} </h5>
                    <h5>
                        This product is ${!lock.status ? 'unlocked' : 'locked'}
                        by admin.
                    </h5>
                    <p>Reason: ${lock.reason}</p>
                    <a
                        href="${process.env.CLIENT_URL}/detail/${productId}"
                        style="
                            padding: 0.5rem 0.8rem;
                            border-radius: 10px;
                            background-color: #2954ad;
                            color: #ffffff;
                            text-decoration: none;
                            display: inline-block;
                            font-weight: 600;
                                    ">
                        Link product
                    </a>
                </div>
            `,
        );
        res.send({
            ok: true,
            message: `${
                !lock.status ? 'Unlocked' : 'Locked'
            } product with id = ${productId}`,
        });
    } catch (error) {
        next(new ApiError(error.code || 500, error.message || error));
    }
};
export default {
    addProduct,
    deleteProduct,
    deleteAllProducts,
    deleteManyProducts,
    getProductsByUserId,
    getProductByProductId,
    getAll,
    updateProduct,
    toggleActive,
    toggleLock,
};
