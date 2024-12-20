import express from 'express';
import { authenticatedRoute } from '../middleware/index.js';
import trimRequest from 'trim-request';
import { getUsers } from 'controller/users/users.get.ts';

const router = express.Router();

router.route('/').get(getUsers);

export default router;
