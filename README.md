# 🎤 Intelligent Voice Bot

> A sophisticated voice-first conversational interface with Swiss Minimalist design and zero recurring costs.

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## 📸 Screenshots

### Landing Page
![Landing Page](client/public/Landing_Page.png)

### Chat Interface
![Chat Interface](client/public/Chat_Interface.png)

### Analytics Dashboard
![Analytics Dashboard](client/public/Analytics.png)

### Working Demo
![Working Demo](client/public/Working.png)

---

## ✨ Features

- 🎤 **Real-time Voice Input** - Browser-native Web Speech API (zero cost)
- 🤖 **AI Conversations** - Powered by Groq API (Llama 3.3 70B)
- 🔊 **Natural Speech Output** - Optimized text-to-speech synthesis
- 😊 **Sentiment Analysis** - Real-time emotion detection with VADER
- 📈 **Analytics Dashboard** - Session metrics, response times, error tracking
- 📄 **PDF Export** - Download conversation transcripts

## 🚀 Quick Start

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

## 🏗️ Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS 3.4
- **State:** Zustand 4.4
- **3D Graphics:** Three.js r128
- **APIs:** Web Speech API, Canvas API, Audio API

### Backend
- **Runtime:** Node.js 18+ with Express 4.18
- **Database:** MongoDB with Mongoose 8.0
- **AI:** Groq API
- **Sentiment:** Groq API
- **Security:** express-rate-limit, Zod validation, CORS

## 📁 Project Structure

```
/project-root
├── /client                  # React frontend
│   ├── /src
│   │   ├── /components
│   │   │   ├── /core       # Layout, MicButton, AudioVisualizer
│   │   │   ├── /chat       # ChatContainer, ChatBubble
│   │   │   ├── /dashboard  # StatCard, SentimentChart
│   │   │   └── /welcome    # WelcomeScreen, BotVisualizer (3D)
│   │   ├── /hooks          # useSpeechToText, useTextToSpeech
│   │   ├── /services       # api.ts (axios)
│   │   ├── /store          # useStore.ts (zustand)
│   │   ├── /utils          # pdfExport.ts
│   │   └── /types          # TypeScript interfaces
│   └── /public             # Static assets (SVG logos)
│
└── /server                  # Express backend
    ├── /src
    │   ├── /controllers    # chatController, analyticsController
    │   ├── /models         # Session.ts, Message.ts (Mongoose)
    │   ├── /routes         # chatRoutes, analyticsRoutes
    │   ├── /services       # groqService, sentimentService
    │   └── /middleware     # errorHandler, rateLimiter
    └── .env                # Environment variables (gitignored)
```

## 🌐 API Endpoints

### Chat
```
POST /api/chat/message              # Send message, get AI response
POST /api/chat/conversation/new     # Create new session
GET  /api/chat/conversation/:sessionId  # Get conversation history
```

### Analytics
```
GET /api/analytics/:sessionId       # Get session metrics
```

## 📱 Browser Compatibility

| Browser | Speech Recognition | Overall Support |
|---------|-------------------|-----------------|
| Chrome  | ✅ Full           | ✅ Recommended  |
| Edge    | ✅ Full           | ✅ Recommended  |
| Safari  | ⚠️ Limited        | ⚠️ Partial      |
| Firefox | ❌ Not Supported  | ❌ Not Recommended |

*Note: Web Speech API support varies by browser. Chrome/Edge provide the best experience.*

## 🧪 Testing

### Build Tests
```powershell
# Test server build
cd server
npm run build    # ✅ Should pass

# Test client build
cd client
npm run build    # ✅ Should pass
```

## 🚀 Production Deployment

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

## 💡 Key Features Explained

### Zero-Cost Architecture
- **Speech Processing:** Browser-native (Web Speech API) - no cloud STT/TTS costs
- **AI Inference:** Groq API free tier (30 requests/minute)
- **Database:** MongoDB Atlas free tier (512MB)
- **Hosting:** Static client can deploy to Vercel/Netlify free tier

### Context-Aware Conversations
- Backend maintains last 5 messages per session
- AI remembers conversation thread
- Natural, coherent multi-turn dialogues

### Sentiment-Reactive UI
- Real-time VADER sentiment analysis (-1.0 to +1.0)
- 3D bot changes color: Blue (happy), Orange (neutral), Red (angry)
- Chat bubbles use gradient colors based on sentiment
- Background subtly shifts based on user mood

### Analytics Dashboard
- **Total Queries:** Count of user messages
- **Average Response Time:** AI latency tracking
- **Sentiment Score:** Current conversation mood
- **Session Duration:** Time since session start
- **Fastest/Slowest Response:** Performance metrics
- **Error Rate:** Percentage of failed requests
- **Query Count:** Messages per session

## 🐛 Troubleshooting

### Microphone Not Working
- Check browser permissions (chrome://settings/content/microphone)
- Use HTTPS or localhost (required for Web Speech API)
- Try Chrome/Edge instead of Firefox/Safari

### AI Not Responding
- Verify `GROQ_API_KEY` in server/.env
- Check server console for error messages
- Ensure rate limit not exceeded (30 req/min)

### MongoDB Connection Failed
- Check `MONGODB_URI` in server/.env
- Ensure MongoDB is running locally OR
- Verify Atlas cluster whitelist (0.0.0.0/0 for testing)

### Build Errors
- Delete node_modules and package-lock.json
- Run `npm install` again
- Ensure Node.js v18+

## 🎯 Future Enhancements

- [ ] Voice activity detection (auto start/stop)
- [ ] Multi-language support
- [ ] User authentication
- [ ] Conversation history persistence
- [ ] Custom AI model training
- [ ] WebSocket for real-time updates
- [ ] Progressive Web App (PWA)

## 📝 License

MIT License - Free to use, modify, and distribute
