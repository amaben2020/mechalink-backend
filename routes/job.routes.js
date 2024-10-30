import express from 'express';
import { authenticatedRoute } from '../middleware/index.js';
import trimRequest from 'trim-request';
import { create } from 'controller/jobs/job.create.js';

const router = express.Router();

router.route('/jobs').post(trimRequest.all, authenticatedRoute, create);

export default router;
