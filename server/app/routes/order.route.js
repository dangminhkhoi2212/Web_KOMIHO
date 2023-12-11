import express from 'express';
import {
    createOrder,
    getOrder,
    updateOrder,
} from '../controllers/order.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
const router = express.Router();

router
    .route('/')
    .get(verifyToken, getOrder)
    .put(verifyToken, updateOrder)
    .post(verifyToken, createOrder);
export default router;
