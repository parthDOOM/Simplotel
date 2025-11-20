import { Router } from 'express';
import { getAnalytics } from '../controllers/analyticsController';

const router = Router();

router.get('/:sessionId', getAnalytics);

export default router;
