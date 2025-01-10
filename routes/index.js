import express from 'express';
import authRoutes from './auth.routes.js';
import jobRoutes from './job.routes.js';
import mechanicRoutes from './mechanic.routes.js';
import jobRequestRoutes from './jobRequest.routes.js';
import userRoutes from './user.routes.js';
import jobTimerRoutes from './jobTimer.routes.js';
import nearbyMechanicRoutes from './nearbyMechanics.routes.js';

const router = express.Router();

// all resources and endpoints here
router.use('/auth', authRoutes);
router.use('/jobs', jobRoutes);
router.use('/mechanics', mechanicRoutes);
router.use('/jobRequests', jobRequestRoutes);
router.use('/users', userRoutes);
router.use('/jobTimers', jobTimerRoutes);
router.use('/nearby-mechanics', nearbyMechanicRoutes);

export default router;
