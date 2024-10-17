import express from 'express';
import authRoutes from './auth.routes.js';

const router = express.Router();

// all resources and endpoints here
router.use('/auth', authRoutes);

export default router;
