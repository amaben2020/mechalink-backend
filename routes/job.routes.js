import express from 'express';
import { authenticatedRoute } from '../middleware/index.js';
import trimRequest from 'trim-request';
import { create } from 'controller/jobs/job.create.ts';
import { getAll } from 'controller/jobs/job.getAll.ts';

const router = express.Router();

router.route('/jobs').post(trimRequest.all, authenticatedRoute, create);

// very public route
router.route('').get(getAll);

export default router;
