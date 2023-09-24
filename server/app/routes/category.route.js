import express from 'express';
import {
    createCategory,
    addProductsToCategory,
    deleteCategory,
    deleteProductFromCategory,
} from '../controllers/category.controller.js';
const router = express.Router();

router.route('/add-product/:categoryId').put(addProductsToCategory);
router.route('/delete-product/:categoryId').put(deleteProductFromCategory);
router.route('/:categoryId').put(addProductsToCategory).delete(deleteCategory);
router.route('/').post(createCategory);
export default router;
