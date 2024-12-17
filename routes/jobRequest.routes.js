import express from 'express';
import { authenticatedRoute } from '../middleware/index.js';
import trimRequest from 'trim-request';
import {
  jobRequestCreateController,
  jobRequestGetController,
} from 'controller/jobRequests/index.ts';
import { jobRequestForMechanicGetController } from 'controller/jobRequests/jobRequest.get.ts';

const router = express.Router();

router
  .route('/')
  .post(trimRequest.all, authenticatedRoute, jobRequestCreateController);

router.route('/').get(trimRequest.all, jobRequestGetController);
router
  .route('/:mechanicId')
  .get(trimRequest.all, jobRequestForMechanicGetController);

export default router;
