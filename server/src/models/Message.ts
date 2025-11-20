import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  sessionId: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
  sentimentScore?: number;
  intent?: string;
  latencyMs?: number;
}

const messageSchema = new Schema<IMessage>({
  sessionId: { type: String, ref: 'Session', required: true },
  role: { type: String, enum: ['user', 'bot'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  sentimentScore: { type: Number, min: -1, max: 1 },
  intent: { type: String },
  latencyMs: { type: Number }
});

export const Message = mongoose.model<IMessage>('Message', messageSchema);
