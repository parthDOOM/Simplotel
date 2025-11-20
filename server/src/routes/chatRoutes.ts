import { Router } from 'express';
import { sendMessage, getConversation } from '../controllers/chatController';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/message', apiLimiter, sendMessage);
router.get('/conversation/:sessionId', getConversation);

export default router;
