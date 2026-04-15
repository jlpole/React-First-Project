import express from 'express';
import { 
  sendInterest, 
 
} from '../Controllers/interestController.js';
import {  authenticateToken} from '../middleware/auth.js';
import { getOwnerInterestMessages, markMessageAsRead,getOwnerMessageStats } from '../Controllers/GetInterest.js'

const router = express.Router();


router.post('/send',  authenticateToken, sendInterest);

router.get('/owner/messages', authenticateToken, getOwnerInterestMessages);


router.patch('/owner/messages/:messageId/read', authenticateToken, markMessageAsRead);


router.get('/owner/stats', authenticateToken, getOwnerMessageStats);


export default router;