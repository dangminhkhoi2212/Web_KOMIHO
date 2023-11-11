import express from 'express';
import {
    checkFavorite,
    toggleFavorite,
    getFavorite,
} from '../controllers/favorite.controller.js';
const router = express.Router();
router.route('/check').get(checkFavorite);
router.route('/').patch(toggleFavorite).get(getFavorite);
export default router;
