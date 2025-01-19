import express from 'express';
import { authenticatedRoute } from '../middleware/index.js';
import trimRequest from 'trim-request';
import { create } from 'controller/jobs/job.create.ts';
import { getAll, getAllByUser } from 'controller/jobs/job.getAll.ts';
import { approveJob } from 'controller/jobs/job.approve.ts';
import { completeJob } from 'controller/jobs/job.complete.ts';
import { get } from 'controller/jobs/job.get.ts';

const router = express.Router();

router.route('/jobs').post(trimRequest.all, authenticatedRoute, create);
router.route('/:jobId').put(approveJob);
router.route('/:jobId/:mechanicId').put(completeJob);

// public routes
router.route('').get(getAll);
router.route('/:userId').get(getAllByUser);
router.route('/job/:jobId').get(get);

export default router;
