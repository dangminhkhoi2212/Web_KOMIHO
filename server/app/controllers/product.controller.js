import { query } from 'express';
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
    const data = req.body;
    try {
        const files = req.files;

        if (files && files.length > 0) {
            // Wait for all the file upload promises to resolve
            const time = new Date().toISOString();
            const uploadPromises = await Promise.all(
                files.map((file) => {
                    return uploadToCloudinary(
                        file.path,
                        'image',
                        `komiho/users/${data.userId}/products/${data.name}-${time}`,
                    );
                }),
            );
            data.images = uploadPromises.map((image) => {
                let result = {
                    url: image.url,
                    public_id: image.public_id,
                };
                return result;
            });
        }
        if ('price' in data) {
            data.price = JSON.parse(data.price);
        }
        if ('color' in data) {
            data.color = JSON.parse(data.color);
        }

        await Product.create(data);

        res.send({ title: 'Add Product', status: 'success' });
    } catch (error) {
        next(
            new ApiError(
                error.code || 500,
                error.message || error.error.message,
            ),
        );
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId);

        if (!product) return next(new ApiError(405, 'Product not found'));

        const path = product.images[0].public_id;
        const index = path.lastIndexOf('/');
        const folder = path.slice(0, index);
        await deleteResources(folder);
        await deleteFolder(folder);
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
const getProductByUserId = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const textSearch = req.query.textSearch;
        const type = req.query.type;

        const result = await Product.find({
            ...(textSearch
                ? { $or: [{ name: textSearch }, { tags: textSearch }] }
                : {}),
            ...(type ? { type } : {}),
            userId,
        });
        res.send(result);
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
export default {
    addProduct,
    deleteProduct,
    deleteAllProducts,

    getProductByUserId,
};
