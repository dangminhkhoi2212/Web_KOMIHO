import express from 'express';
import {
    getCartsByUserId,
    addToCart,
    deleteCart,
} from '../controllers/cart.controller.js';
const router = express.Router();
router.route('/:userId').get(getCartsByUserId);
router.route('/').post(addToCart).delete(deleteCart);
export default router;
