import express from 'express';
import { activateDomain, initiateDomainConnect, verifyDomainDNS } from '../controllers/domain.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();


router.post('/initiate',authenticate, initiateDomainConnect);
router.post('/verify',authenticate, verifyDomainDNS);
router.post('/active',authenticate, activateDomain)

export default router;