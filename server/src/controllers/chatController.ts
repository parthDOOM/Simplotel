import { Request, Response } from 'express';
import { Message } from '../models/Message';
import { Session } from '../models/Session';
import { generateResponse } from '../services/groqService';
import { analyzeSentiment } from '../services/sentiment';
import { z } from 'zod';

const messageSchema = z.object({
  sessionId: z.string(),
  content: z.string().min(1).max(1000),
  userId: z.string(),
  deviceType: z.enum(['mobile', 'desktop']),
  browser: z.string(),
  language: z.string().optional()
});

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Received message request:', req.body);
    const validatedData = messageSchema.parse(req.body);
    const startTime = Date.now();

    let session = await Session.findOne({ _id: validatedData.sessionId });
    
    if (!session) {
      session = new Session({
        _id: validatedData.sessionId,
        userId: validatedData.userId,
        deviceType: validatedData.deviceType,
        browser: validatedData.browser,
        totalQueries: 1,
        errorCount: 0
      });
      await session.save();
    } else {
      session.lastActive = new Date();
      session.totalQueries = (session.totalQueries || 0) + 1;
      await session.save();
    }

    const sentimentScore = await analyzeSentiment(validatedData.content);
    console.log('Sentiment score:', sentimentScore);

    const userMessage = await Message.create({
      sessionId: session._id,
      role: 'user',
      content: validatedData.content,
      sentimentScore
    });

    const previousMessages = await Message.find({ sessionId: session._id })
      .sort({ timestamp: -1 })
      .limit(5)
      .lean();

    const context = previousMessages
      .reverse()
      .map(msg => `${msg.role === 'user' ? 'User' : 'Bot'}: ${msg.content}`);

    // Check if user is asking for account/session information
    const lowerContent = validatedData.content.toLowerCase();
    let botResponse: string;
    const language = validatedData.language || 'en-US';
    
    if (lowerContent.includes('user id') || lowerContent.includes('my id') || lowerContent.includes('account id')) {
      // Dynamic data fetch - retrieve user information from database
      botResponse = `Your user ID is: ${session.userId}. This session was created on ${session.startTime.toLocaleDateString()} and you've made ${session.totalQueries} queries so far.`;
    } else if (lowerContent.includes('session info') || lowerContent.includes('account status') || lowerContent.includes('my account')) {
      // Dynamic data fetch - retrieve session details from database
      const totalMessages = await Message.countDocuments({ sessionId: session._id });
      const sessionDuration = Math.round((Date.now() - session.startTime.getTime()) / 1000 / 60); // minutes
      botResponse = `Here's your account status:\n- User ID: ${session.userId}\n- Device: ${session.deviceType}\n- Browser: ${session.browser}\n- Session Duration: ${sessionDuration} minutes\n- Total Messages: ${totalMessages}\n- Total Queries: ${session.totalQueries}`;
    } else if (lowerContent.includes('message count') || lowerContent.includes('how many messages')) {
      // Dynamic data fetch - count messages from database
      const messageCount = await Message.countDocuments({ sessionId: session._id });
      botResponse = `You have sent ${messageCount} messages in this conversation session.`;
    } else {
      // Regular AI response with language
      console.log('Generating AI response in language:', language);
      botResponse = await generateResponse(validatedData.content, context, language);
    }
    
    const latencyMs = Date.now() - startTime;

    const botMessage = await Message.create({
      sessionId: session._id,
      role: 'bot',
      content: botResponse,
      latencyMs
    });

    res.json({
      success: true,
      data: {
        userMessage,
        botMessage,
        sentimentScore,
        latencyMs
      }
    });
  } catch (error: any) {
    console.error('Error in sendMessage:', error);
    
    // Increment error count
    try {
      const sessionId = req.body.sessionId;
      if (sessionId) {
        await Session.findOneAndUpdate(
          { _id: sessionId },
          { $inc: { errorCount: 1 } }
        );
      }
    } catch (updateError) {
      console.error('Failed to update error count:', updateError);
    }
    
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Invalid input data', errors: error.errors });
    } else {
      res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
  }
};

export const getConversation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;
    
    const messages = await Message.find({ sessionId })
      .sort({ timestamp: 1 })
      .lean();

    res.json({
      success: true,
      data: messages
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
