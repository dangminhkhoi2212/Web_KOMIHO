import express from 'express';
import {
    getCart,
    addToCart,
    deleteCart,
    updateCart,
} from '../controllers/cart.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
const router = express.Router();
router
    .route('/')
    .get(getCart)
    .post(verifyToken, addToCart)
    .delete(verifyToken, deleteCart)
    .put(verifyToken, updateCart);
export default router;
