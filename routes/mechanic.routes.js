import express from 'express';
import { authenticatedRoute } from '../middleware/index.js';
import trimRequest from 'trim-request';
import { mechanicCreateController } from 'controller/mechanics/mechanic.create.ts';
import {
  mechanicsByUserIdGetController,
  mechanicsGetController,
} from 'controller/mechanics/mechanic.get.ts';
import { updateMechanicTermsAndConditions } from 'controller/mechanics/mechanic.put.ts';

const router = express.Router();

router
  .route('/')
  .post(trimRequest.all, authenticatedRoute, mechanicCreateController);

router.route('/').get(trimRequest.all, mechanicsGetController);
router.route('/:userId').get(trimRequest.all, mechanicsByUserIdGetController);

router
  .route('/terms-and-conditions')
  .put(trimRequest.all, updateMechanicTermsAndConditions);

export default router;
