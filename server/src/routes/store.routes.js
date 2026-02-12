import express from 'express';
import { rateLimit } from 'express-rate-limit';
import * as storeController from '../controllers/store.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

const createStoreLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 212,
  message: 'Too many stores created, please try again later'
});


router.post('/', createStoreLimiter, authenticate, storeController.createStore);
router.delete('/',authenticate, storeController.deleteStore);
router.get("/", authenticate, storeController.getMyStores);
router.post("/deploy-medusa-storefront", authenticate, storeController.deployStorefront);



export default router;