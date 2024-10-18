import express from 'express';
import trimRequest from 'trim-request';
import { signup } from '../controller/auth/auth.register.js';
import { confirmSignup } from '../controller/auth/auth.confirmUser.js';
// todo: do the auth middlewares for protected routes
// import { authMiddleware } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.route('/register').post(trimRequest.all, signup);
router.route('/confirm').post(trimRequest.all, confirmSignup);

export default router;
