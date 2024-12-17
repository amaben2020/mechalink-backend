import express from 'express';
import authRoutes from './auth.routes.js';
import jobRoutes from './job.routes.js';
import mechanicRoutes from './mechanic.routes.js';
import jobRequestRoutes from './jobRequest.routes.js';

const router = express.Router();

// all resources and endpoints here
router.use('/auth', authRoutes);
router.use('/jobs', jobRoutes);
router.use('/mechanics', mechanicRoutes);
router.use('/jobRequests', jobRequestRoutes);

export default router;
