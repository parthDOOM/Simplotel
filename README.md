# Intelligent Voice Bot

> A sophisticated voice-first conversational interface AI-powered responses.

![License](https://img.shields.io/badge/license-MIT-blue)

## Screenshots

### Landing Page
![Landing Page](client/public/Landing_Page.png)

### Chat Interface
![Chat Interface](client/public/Chat_Interface.png)

### Analytics Dashboard
![Analytics Dashboard](client/public/Analytics.png)

### Working Demo
![Working Demo](client/public/Working.png)

---

## Features

- **Real-time Voice Input** - Browser-native Web Speech API with multi-language support
- **AI Conversations** - Powered by Groq API (Llama 3.3 70B)
- **Natural Speech Output** - Text-to-speech synthesis with language-specific voices
- **Multi-Language Support** - English, Hindi, Gujarati, Spanish, French, German
- **Barge-in Capability** - Interrupt the bot while it's speaking naturally
- **Sentiment Analysis** - Real-time emotion detection with VADER
- **Analytics Dashboard** - Session metrics, response times, error tracking
- **PDF Export** - Download conversation transcripts
- **Dynamic Data Retrieval** - Query session info, user ID, message counts

## Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Modern browser (Chrome/Edge recommended)

### Installation

```powershell
# 1. Install dependencies
cd server
npm install
cd ../client
npm install

# 2. Configure environment
cd server
copy .env.example .env
# Edit .env and add your GROQ_API_KEY and MONGODB_URI

# 3. Start the application
cd ../server
npm run dev
# In another terminal:
cd client
npm run dev

# 4. Open http://localhost:3000
```

### Environment Variables (server/.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/voicebot
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/voicebot

GROQ_API_KEY=your_groq_api_key_here
NODE_ENV=development
```

## Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS 3.4
- **State:** Zustand 4.4
- **3D Graphics:** Three.js r128
- **APIs:** Web Speech API (Speech Recognition & Synthesis)

### Backend
- **Runtime:** Node.js 18+ with Express 4.18
- **Database:** MongoDB with Mongoose 8.0
- **AI:** Groq SDK (Llama 3.3 70B Versatile)
- **Sentiment:** VADER Sentiment
- **Validation:** Zod
- **Security:** express-rate-limit, CORS


## API Endpoints

### Chat
```
POST /api/chat/message              # Send message, get AI response
GET  /api/chat/conversation/:sessionId  # Get conversation history
```

### Analytics
```
GET /api/analytics/:sessionId       # Get session metrics
```

## Language Support

The application supports 6 languages. Users select their preferred language on the welcome screen before starting a conversation:

- **English (en-US)** - Full support
- **Hindi (hi-IN)** - Full support
- **Gujarati (gu-IN)** - AI responses in Gujarati (TTS may use fallback voice)
- **Spanish (es-ES)** - Full support
- **French (fr-FR)** - Full support
- **German (de-DE)** - Full support

**Note:** Speech synthesis voice availability depends on your operating system and browser. Some languages may use fallback voices if native voices aren't available.

## Browser Compatibility

| Browser | Speech Recognition | Speech Synthesis | Overall Support |
|---------|-------------------|------------------|-----------------|
| Chrome  | Full              | Full             | Recommended     |
| Edge    | Full              | Full             | Recommended     |
| Safari  | Limited           | Partial          | Partial         |
| Firefox | Not Supported     | Partial          | Not Recommended |

**Note:** Web Speech API support varies by browser. Chrome and Edge provide the best experience with full support for both speech recognition and synthesis.

## Key Features

### Multi-Language Conversations
- Select language once at session start
- AI responds in the selected language
- Speech recognition transcribes in the selected language
- Text-to-speech speaks with appropriate accent/voice

### Barge-in Interruption
- Speak while the bot is talking to interrupt it naturally
- Microphone stays active during bot speech
- Automatically stops bot speech when user starts speaking

### Context-Aware AI
- Backend maintains last 3 conversation exchanges
- AI remembers conversation thread
- Natural, coherent multi-turn dialogues

### Sentiment-Reactive UI
- Real-time VADER sentiment analysis (-1.0 to +1.0)
- Background color shifts based on user mood
- Blue tint for positive, amber for negative

### Dynamic Data Queries
Ask the bot:
- "What is my user ID?" - Returns session information
- "Show my account status" - Returns session details, duration, message count
- "How many messages have I sent?" - Returns message count

### Analytics Dashboard
- Total Queries count
- Average Response Time
- Current Sentiment Score
- Session Duration
- Fastest/Slowest Response times
- Error Rate percentage
- PDF export of conversation

## Testing

### Build Tests
```powershell
# Test server build
cd server
npm run build

# Test client build
cd client
npm run build
```

## Production Deployment

### Build for Production
```powershell
# Server
cd server
npm run build
npm start

# Client
cd client
npm run build
# Serve dist/ folder with nginx/apache/vercel
```

### Environment Setup
- Set `NODE_ENV=production`
- Use production MongoDB URI (MongoDB Atlas recommended)
- Secure GROQ_API_KEY
- Enable HTTPS
- Configure CORS for production domain
- Whitelist production IPs in MongoDB Atlas

## License

MIT License - Free to use, modify, and distribute
