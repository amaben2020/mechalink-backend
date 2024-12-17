import express from 'express';
import { authenticatedRoute } from '../middleware/index.js';
import trimRequest from 'trim-request';
import { mechanicCreateController } from 'controller/mechanics/mechanic.create.ts';
import { mechanicsGetController } from 'controller/mechanics/mechanic.get.ts';

const router = express.Router();

router
  .route('/')
  .post(trimRequest.all, authenticatedRoute, mechanicCreateController);

router.route('/').get(trimRequest.all, mechanicsGetController);

// public routes
// router.route('').get(mechanicCreateController);

export default router;
