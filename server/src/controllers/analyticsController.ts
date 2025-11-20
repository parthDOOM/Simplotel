import { Request, Response } from 'express';
import { Message } from '../models/Message';
import { Session } from '../models/Session';

export const getAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;

    const messageCount = await Message.countDocuments({ sessionId });
    
    const messages = await Message.find({ sessionId }).lean();
    
    const avgResponseTime = messages
      .filter(m => m.role === 'bot' && m.latencyMs)
      .reduce((sum, m) => sum + (m.latencyMs || 0), 0) / 
      messages.filter(m => m.role === 'bot' && m.latencyMs).length || 0;

    const userMessages = messages.filter(m => m.role === 'user' && m.sentimentScore !== undefined);
    const avgSentiment = userMessages.reduce((sum, m) => sum + (m.sentimentScore || 0), 0) / userMessages.length || 0;

    const sentimentTrend = userMessages.map(m => ({
      timestamp: m.timestamp,
      score: m.sentimentScore
    }));

    const session = await Session.findById(sessionId).lean();
    let sessionDuration = 0;
    
    if (messages.length >= 2) {
      const firstMsg = messages[0];
      const lastMsg = messages[messages.length - 1];
      sessionDuration = (new Date(lastMsg.timestamp).getTime() - new Date(firstMsg.timestamp).getTime()) / 1000;
    } else if (session) {
      sessionDuration = (session.lastActive.getTime() - session.startTime.getTime()) / 1000;
    }

    // Calculate additional metrics
    const totalQueries = session?.totalQueries || messageCount;
    const errorCount = session?.errorCount || 0;
    const errorRate = totalQueries > 0 ? ((errorCount / totalQueries) * 100).toFixed(1) : '0.0';
    
    // Calculate fastest and slowest response times
    const responseTimes = messages
      .filter(m => m.role === 'bot' && m.latencyMs)
      .map(m => m.latencyMs || 0);
    const fastestResponse = responseTimes.length > 0 ? Math.min(...responseTimes) : 0;
    const slowestResponse = responseTimes.length > 0 ? Math.max(...responseTimes) : 0;

    res.json({
      success: true,
      data: {
        messageCount,
        avgResponseTime: Math.round(avgResponseTime),
        avgSentiment: parseFloat(avgSentiment.toFixed(2)),
        sentimentTrend,
        sessionDuration: Math.round(sessionDuration),
        totalQueries,
        errorCount,
        errorRate: parseFloat(errorRate),
        fastestResponse,
        slowestResponse
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
