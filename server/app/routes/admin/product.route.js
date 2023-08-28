import express from 'express';
import {
    addProduct,
    deleteAllProducts,
    deleteProduct,
} from '../../controllers/admin/product.controller.js';
import multer from '../../lib/multerConfig.js';
const router = express.Router();

router.route('/add').post(addProduct);
router.route('/delete/:productId').delete(deleteProduct);
router.route('/delete').post(deleteAllProducts);

export default router;
