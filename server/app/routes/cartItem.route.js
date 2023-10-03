import express from 'express';

import {
    create,
    deleteCartItem,
    update,
} from '../controllers/cartItem.controller.js';
const router = express.Router();
router.route('/:cartItemId').put(update);
router.route('/').post(create).delete(deleteCartItem);
export default router;
