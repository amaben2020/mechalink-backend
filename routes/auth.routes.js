import express from 'express';
import trimRequest from 'trim-request';
import { signup } from '../controller/auth/controller.js';
// import { authMiddleware } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.route('/register').post(trimRequest.all, signup);

export default router;
