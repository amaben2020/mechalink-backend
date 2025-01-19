import express from 'express';
import { authenticatedRoute } from '../middleware/index.js';
import trimRequest from 'trim-request';
import { create } from 'controller/jobs/job.create.ts';
import { getAll, getAllByUser } from 'controller/jobs/job.getAll.ts';
import { get } from 'controller/jobs/job.get.ts';
import { approveJob } from 'controller/jobs/job.approve.ts';

const router = express.Router();

router.route('/jobs').post(trimRequest.all, authenticatedRoute, create);
router.route('/:jobId').put(approveJob);

// public routes
router.route('').get(getAll);
router.route('/:userId').get(getAllByUser);
router.route('/job').get(get);

export default router;
