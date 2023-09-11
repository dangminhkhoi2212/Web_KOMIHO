import express from 'express';
import productController from '../controllers/product.controller.js';
import multer from '../lib/multerConfig.js';
const router = express.Router();

router.route('/add').post(multer.array('images'), productController.addProduct);
router
    .route('/get-by-userId/:userId')
    .get(productController.getProductByUserId);
router.route('/delete/:productId').delete(productController.deleteProduct);
router.route('/delete').post(productController.deleteAllProducts);

export default router;
