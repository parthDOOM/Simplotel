import axios from 'axios';
import { Message, Analytics } from '../types';

// Use environment variable in production, localhost in development
const API_BASE_URL = import.meta.env.PROD 
  ? import.meta.env.VITE_API_URL || '/api'  // Use env var or fallback to relative path
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const sendMessage = async (
  sessionId: string,
  content: string,
  userId: string,
  deviceType: 'mobile' | 'desktop',
  browser: string
) => {
  const response = await api.post('/chat/message', {
    sessionId,
    content,
    userId,
    deviceType,
    browser
  });
  return response.data;
};

export const getConversation = async (sessionId: string): Promise<{ success: boolean; data: Message[] }> => {
  const response = await api.get(`/chat/conversation/${sessionId}`);
  return response.data;
};

export const getAnalytics = async (sessionId: string): Promise<{ success: boolean; data: Analytics }> => {
  const response = await api.get(`/analytics/${sessionId}`);
  return response.data;
};

export default api;
