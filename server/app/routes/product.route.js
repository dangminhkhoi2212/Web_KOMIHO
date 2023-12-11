import express from 'express';
import productController from '../controllers/product.controller.js';
import multer from '../lib/multerConfig.js';
import { verifyEmail } from '../controllers/mail.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
const router = express.Router();

router.route('/add').post(verifyToken, productController.addProduct);
router.route('/active').get(verifyToken, productController.toggleActive);
router.route('/delete').delete(verifyToken, productController.deleteProduct);
router.route('/lock').patch(verifyToken, productController.toggleLock);
router
    .route('/update/:productId')
    .put(verifyToken, productController.updateProduct);
router
    .route('/delete-many')
    .post(verifyToken, productController.deleteManyProducts);
router
    .route('/get-by-userId/:userId')
    .get(productController.getProductsByUserId);
router.route('/:productId').get(productController.getProductByProductId);
router.route('/').get(productController.getAll);

export default router;
