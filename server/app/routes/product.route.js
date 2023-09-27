import express from 'express';
import productController from '../controllers/product.controller.js';
import multer from '../lib/multerConfig.js';
const router = express.Router();

router.route('/add').post(productController.addProduct);
router.route('/delete/:productId').delete(productController.deleteProduct);
router.route('/update/:productId').put(productController.updateProduct);
router.route('/delete-many').post(productController.deleteManyProducts);
router.route('/:productId').get(productController.getProductByProductId);
router.route('/').get(productController.getProducts);

export default router;
