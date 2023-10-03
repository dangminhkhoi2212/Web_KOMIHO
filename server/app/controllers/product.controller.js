import mongoose from 'mongoose';
import Product from '../models/product.model.js';
import User from '../models/user.model.js';
import {
    deleteFile,
    deleteFolder,
    deleteResources,
    getFolder,
    uploadToCloudinary,
} from '../services/cloudinary.service.js';
import ApiError from '../utils/apiError.js';

User.watch().on('change', async (data) => {
    try {
        if (data.operationType === 'delete') {
            const userId = data.documentKey._id.toString();
            await deleteOnCloudinary(userId);
            await Product.deleteMany({ userId });
        }
    } catch (error) {
        console.log(
            '🚀 ~ file: product.controller.js:16 ~ User.watch ~ error:',
            error,
        );
    }
});

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
        var { name, userId, price, colors, images, tags, description, store } =
            req.body;

        await Product.create({
            name,
            userId,
            price,
            colors,
            images,
            tags,
            description,
            store,
        });
        await User.findByIdAndUpdate(userId, { $inc: { productTotal: 1 } });
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
                return next(new ApiError('402', "List product don't find"));

            await Product.deleteMany({ _id: { $in: ids } });
            await User.findByIdAndUpdate(userId, {
                $inc: { productTotal: -ids.length },
            });
            return res.send({
                title: `Deleted products have id ${ids}`,
                ok: true,
            });
        }
        return next(new ApiError(402, 'List products empty'));
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

        const userId = req.params.userId;
        if (!userId) return next(new ApiError(401, 'userId not found.'));
        const textSearch = `${userId} ${data.textSearch}`;
        const user = await User.findById(userId);
        if (!user) return next(new ApiError(404, 'User not found.'));

        const page = parseInt(data.page) || 1;
        const limit = parseInt(data.limit) || 20;

        const skip = (page - 1) * limit;

        const agg = [
            {
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
            },
            { $sort: { _id: -1 } },
            { $skip: skip },
            {
                $limit: limit,
            },
        ];

        // Find products with the constructed query and sort options
        const [products] = await Promise.all([Product.aggregate(agg)]);
        const pageCount = Math.ceil(user.productTotal / limit);

        res.send({ pageCount, limit, total: products.length, products });
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
        const productId = req.params.productId;
        const result = await Product.findById(productId).populate({
            path: 'userId',
            select: 'name avatar.url createdAt productTotal',
        });
        res.send(result);
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
        console.log(
            '🚀 ~ file: product.controller.js:267 ~ toggleActive ~ req.query:',
            req.query,
        );
        if (!productId)
            return next(new ApiError(402, 'Don not find productId'));
        await Product.findByIdAndUpdate(productId, { active });
        res.send({ ok: true, props: { productId, active } });
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
    updateProduct,
    toggleActive,
};
