import express from 'express';
import { authenticatedRoute } from '../middleware/index.js';
import trimRequest from 'trim-request';
import { getNearbyMechanicsController } from './../controller/nearbyMechanics/nearbyMechanic.get.ts';

const router = express.Router();

router.route('').get(authenticatedRoute, getNearbyMechanicsController);

export default router;
