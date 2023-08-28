import express from 'express';
import { getAdmin } from '../../controllers/admin/admin.controller.js';

const router = express.Router();

router.route('/:adminId').get(getAdmin);

export default router;
