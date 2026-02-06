import express from 'express';
import { rateLimit } from 'express-rate-limit';
import * as storeController from '../controllers/store.controller.js';

const router = express.Router();

const createStoreLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 2,
  message: 'Too many stores created, please try again later'
});


router.post('/', createStoreLimiter, storeController.createStore);


export default router;