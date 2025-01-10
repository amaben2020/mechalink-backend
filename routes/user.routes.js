import express from 'express';
import { authenticatedRoute } from '../middleware/index.js';
import trimRequest from 'trim-request';
import { getUsers } from 'controller/users/users.get.ts';
import { updateUserLocationController } from 'controller/users/users.update.ts';

const router = express.Router();

router.route('/').get(getUsers);
router.route('/user-location').put(updateUserLocationController);

export default router;
