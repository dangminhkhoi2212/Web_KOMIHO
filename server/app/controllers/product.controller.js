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
        console.log(
            '🚀 ~ file: product.controller.js:44 ~ addProduct ~ req.body:',
            req.body,
        );

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
        const productId = req.params.productId;
        const product = await Product.findById(productId);

        if (!product) return next(new ApiError(405, 'Product not found'));

        await Product.findByIdAndDelete(productId);
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
        const ids = req.body.ids;

        if (ids?.length > 0) {
            const manyProduct = await Product.find({ _id: { $in: ids } });
            if (manyProduct.length === 0)
                return next(new ApiError('402', "List product don't find"));

            await Product.deleteMany({ _id: { $in: ids } });
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

const getProducts = async (req, res, next) => {
    try {
        const { userId, textSearch, price, store } = req.query;
        console.log(
            '🚀 ~ file: product.controller.js:143 ~ getProducts ~ userId, textSearch, price, store:',
            { userId, textSearch, price, store },
        );
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;

        const skip = (page - 1) * limit;

        // Build the query conditions
        const query = {
            userId,
        };

        if (textSearch) {
            var findById = { _id: undefined };
            if (mongoose.isValidObjectId(textSearch)) findById._id = textSearch;

            query.$or = [
                findById,
                { name: textSearch },
                { tags: { $regex: textSearch, $options: 'i' } },
            ];
        }

        // Build the sort options
        const sortOptions = {};

        // if (price) {
        //     sortOptions['price.final'] = price === 'asc' ? 1 : -1;
        // } else if (store) {
        //     sortOptions.store = store === 'asc' ? 1 : -1;
        // } else {
        //     sortOptions.createdAt = -1;
        // }

        // Find products with the constructed query and sort options
        const [products, total] = await Promise.all([
            Product.find(query).sort(sortOptions).skip(skip).limit(limit),
            Product.countDocuments(query),
        ]);
        const pageCount = Math.ceil(total / limit);

        res.send({ pageCount, total, products });
    } catch (error) {
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
        const result = await Product.findById(productId);
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

export default {
    addProduct,
    deleteProduct,
    deleteAllProducts,
    deleteManyProducts,
    getProducts,
    getProductByProductId,
    updateProduct,
};
