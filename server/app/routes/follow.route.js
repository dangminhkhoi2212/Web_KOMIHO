import express from 'express';
import {
    addFollower,
    checkFollow,
    getFollow,
} from '../controllers/follow.controller.js';
const router = express.Router();

router.route('/check').get(checkFollow);
router.route('/').get(getFollow).patch(addFollower);
export default router;
