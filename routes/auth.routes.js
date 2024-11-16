import express from 'express';
import trimRequest from 'trim-request';
import { signup } from '../controller/auth/auth.register.js';
import { signin } from '../controller/auth/auth.signIn.js';
// todo: do the auth middlewares for protected routes
// import { authMiddleware } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.route('/register').post(trimRequest.all, signup);
router.route('/signin').post(trimRequest.all, signin);

export default router;
