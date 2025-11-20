export interface Message {
  _id?: string;
  sessionId: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
  sentimentScore?: number;
  intent?: string;
  latencyMs?: number;
}

export interface Session {
  _id: string;
  userId: string;
  startTime: Date;
  lastActive: Date;
  deviceType: 'mobile' | 'desktop';
  browser: string;
  metadata: Record<string, any>;
}

export interface Analytics {
  messageCount: number;
  avgResponseTime: number;
  avgSentiment: number;
  sentimentTrend: Array<{ timestamp: Date; score: number }>;
  sessionDuration: number;
  totalQueries: number;
  errorCount: number;
  errorRate: number;
  fastestResponse: number;
  slowestResponse: number;
}

export type AudioState = 'idle' | 'listening' | 'processing' | 'speaking';
