import { create } from 'zustand';
import { Message, AudioState, Analytics } from '../types';

interface VoiceBotStore {
  sessionId: string;
  messages: Message[];
  audioState: AudioState;
  currentTranscript: string;
  sentimentScore: number;
  analytics: Analytics | null;
  showWelcome: boolean;
  language: string;
  
  setSessionId: (id: string) => void;
  addMessage: (message: Message) => void;
  replaceMessage: (tempId: string, newMessage: Message) => void;
  setMessages: (messages: Message[]) => void;
  setAudioState: (state: AudioState) => void;
  setCurrentTranscript: (transcript: string) => void;
  setSentimentScore: (score: number) => void;
  setAnalytics: (analytics: Analytics) => void;
  setShowWelcome: (show: boolean) => void;
  setLanguage: (language: string) => void;
}

export const useStore = create<VoiceBotStore>((set) => ({
  sessionId: `session_${Date.now()}`,
  messages: [],
  audioState: 'idle',
  currentTranscript: '',
  sentimentScore: 0,
  analytics: null,
  showWelcome: true,
  language: 'en-US',
  
  setSessionId: (id) => set({ sessionId: id }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  replaceMessage: (tempId, newMessage) => set((state) => ({
    messages: state.messages.map(msg => 
      msg._id === tempId ? newMessage : msg
    )
  })),
  setMessages: (messages) => set({ messages }),
  setAudioState: (audioState) => set({ audioState }),
  setCurrentTranscript: (currentTranscript) => set({ currentTranscript }),
  setSentimentScore: (sentimentScore) => set({ sentimentScore }),
  setAnalytics: (analytics) => set({ analytics }),
  setShowWelcome: (showWelcome) => set({ showWelcome }),
  setLanguage: (language) => set({ language })
}));
