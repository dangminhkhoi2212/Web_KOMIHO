import Category from '../models/category.js';
import ApiError from '../utils/apiError.js';

export const createCategory = async (req, res, next) => {
    try {
        const { name, userId } = req.body;

        const result = await Category.create({ name, userId });
        return res.send(result);
    } catch (error) {
        next(
            new ApiError(
                error.code || 500,
                error.message || 'Can not add category',
            ),
        );
    }
};
export const deleteCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId;

        await Category.findByIdAndDelete(categoryId);
        res.json({ title: `${categoryId} is deleted.`, ok: true });
    } catch (error) {
        next(
            new ApiError(
                error.code || 500,
                error.message || 'Can not delete category',
            ),
        );
    }
};
export const addProductsToCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId;
        const { productsId } = req.body;

        const category = await Category.findById(categoryId);
        if (!category)
            return next(new ApiError(400, "Don't find this category"));

        const result = await Category.findByIdAndUpdate(
            categoryId,
            {
                $addToSet: { products: { $each: productsId } },
            },
            { new: true },
        );
        res.send(result);
    } catch (error) {
        console.log(
            '🚀 ~ file: category.controller.js:52 ~ addProductsToCategory ~ error:',
            error,
        );
        next(
            new ApiError(
                error.code || 500,
                error.message || 'Can not add product to category',
            ),
        );
    }
};
export const deleteProductFromCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId;
        const productsId = req.body.productsId;
        const result = await Category.findByIdAndUpdate(
            categoryId,
            {
                $pullAll: { products: productsId },
            },
            { new: true },
        );
        res.send(result);
    } catch (error) {
        next(
            new ApiError(
                error.code || 500,
                error.message || 'Can not delete product req.to category',
            ),
        );
    }
};
