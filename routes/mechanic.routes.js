import express from 'express';
import { authenticatedRoute } from '../middleware/index.js';
import trimRequest from 'trim-request';
import { createMech } from './../controller/mechanics/mechanic.create';
const router = express.Router();

router.route('/').post(trimRequest.all, authenticatedRoute, createMech);

// public routes
// router.route('').get(createMech);

export default router;
