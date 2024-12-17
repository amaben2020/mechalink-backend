import express from 'express';
import { authenticatedRoute } from '../middleware/index.js';
import trimRequest from 'trim-request';
import { mechanicCreateController } from 'controller/mechanics/mechanic.create.ts';

const router = express.Router();

router
  .route('/')
  .post(trimRequest.all, authenticatedRoute, mechanicCreateController);

// public routes
// router.route('').get(mechanicCreateController);

export default router;
