import express from 'express';
import {
    createOrder,
    getOrder,
    updateOrder,
} from '../controllers/order.controller.js';
const router = express.Router();

router.route('/').get(getOrder).put(updateOrder).post(createOrder);
export default router;
