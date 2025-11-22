import mongoose, { Document, Schema } from 'mongoose';

export interface ISession extends Document {
  userId: string;
  startTime: Date;
  lastActive: Date;
  deviceType: 'mobile' | 'desktop';
  browser: string;
  metadata: Record<string, any>;
  totalQueries: number;
  errorCount: number;
}

const sessionSchema = new Schema<ISession>({
  // Cast to 'any' to bypass Mongoose's strict ObjectId check for _id
  _id: { type: String, required: true } as any,
  userId: { type: String, required: true },
  startTime: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
  deviceType: { type: String, enum: ['mobile', 'desktop'], required: true },
  browser: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed, default: {} },
  totalQueries: { type: Number, default: 0 },
  errorCount: { type: Number, default: 0 }
});

export const Session = mongoose.model<ISession>('Session', sessionSchema);