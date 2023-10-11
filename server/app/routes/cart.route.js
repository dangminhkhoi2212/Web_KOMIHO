import express from 'express';
import {
    getCart,
    addToCart,
    deleteCart,
    updateCart,
} from '../controllers/cart.controller.js';
const router = express.Router();
router
    .route('/')
    .get(getCart)
    .post(addToCart)
    .delete(deleteCart)
    .put(updateCart);
export default router;
