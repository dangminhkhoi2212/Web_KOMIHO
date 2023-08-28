import Product from '../../models/product.model.js';
import {
    deleteFile,
    deleteFolder,
    uploadToCloudinary,
} from '../../services/cloudinary.service.js';
import ApiError from '../../utils/apiError.js';
export const addProduct = async (req, res, next) => {
    try {
        const data = req.body;
        console.log(
            '🚀 ~ file: product.controller.js:11 ~ addProduct ~ data:',
            data,
        );
        const files = req.files;

        // const uploadPromises = await Promise.all(
        //     files.map((file) => {
        //         return uploadToCloudinary(
        //             file.path,
        //             'image',
        //             `komiho/products/${data.name}`,
        //         );
        //     }),
        // );
        // data.images = uploadPromises.map((image) => {
        //     let result = {
        //         url: image.url,
        //         public_id: image.public_id,
        //     };
        //     return result;
        // });

        // Wait for all the file upload promises to resolve

        const newProduct = await Product.create(data);
        res.send(newProduct);
    } catch (error) {
        next(
            new ApiError(
                error.code || 500,
                error.message || error.error.message,
            ),
        );
    }
};
const deleteOne = async (productId) => {
    const product = await Product.findById(productId);
    if (product.images) {
        await Promise.all(
            product.images.map(
                async (image) => await deleteFile(image.public_id, 'image'),
            ),
        );
    }
    await deleteFolder(`komiho/products/${product.name}`);
    await Product.findByIdAndDelete(productId);
};
export const deleteProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        await deleteOne(productId);
        res.json({ message: `Successfully deleted ${productId}.` });
    } catch (error) {
        next(
            new ApiError(
                error.code || 500,
                error.message || error.error.message,
            ),
        );
    }
};
export const deleteAllProducts = async (req, res, next) => {
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
