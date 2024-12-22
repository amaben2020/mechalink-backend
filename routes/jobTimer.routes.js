import express from 'express';
import { authenticatedRoute } from '../middleware/index.js';
import trimRequest from 'trim-request';
import { createJobTimerController } from './../controller/jobTimers/jobTimer.create.js';

const router = express.Router();

router
  .route('/mechanics')
  .post(trimRequest.all, authenticatedRoute, createJobTimerController);

export default router;
