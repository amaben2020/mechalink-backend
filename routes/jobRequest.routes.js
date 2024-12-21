import express from 'express';
import { authenticatedRoute } from '../middleware/index.js';
import trimRequest from 'trim-request';
import {
  jobRequestCreateController,
  jobRequestGetController,
} from 'controller/jobRequests/index.ts';
import { jobRequestForMechanicGetController } from 'controller/jobRequests/jobRequest.get.ts';
import {
  jobRequestUpdateController,
  jobRequestSelectMechanicController,
} from 'controller/jobRequests/jobrequest.update.ts';

const router = express.Router();

router
  .route('/')
  .post(trimRequest.all, authenticatedRoute, jobRequestCreateController);

router.route('/mechanic').get(trimRequest.all, jobRequestGetController);
router
  .route('/:mechanicId')
  .get(trimRequest.all, jobRequestForMechanicGetController);

router.route('/user').put(trimRequest.all, jobRequestSelectMechanicController);

export default router;
