import express from 'express';
import {
    checkFavorite,
    toggleFavorite,
    getFavorite,
} from '../controllers/favorite.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
const router = express.Router();
router.route('/check').get(verifyToken, checkFavorite);
router
    .route('/')
    .patch(verifyToken, toggleFavorite)
    .get(verifyToken, getFavorite);
export default router;
