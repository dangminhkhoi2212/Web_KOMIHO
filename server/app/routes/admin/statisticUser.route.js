import express from 'express';

import * as statisticUserController from '../../controllers/admin/statisticUser.controller.js';
const router = express.Router();

router.route('/register').get(statisticUserController.statisticUserRegisterd);
export default router;
