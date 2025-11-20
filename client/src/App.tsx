import { useEffect, useState } from 'react';
import { Layout } from './components/core/Layout';
import { AudioVisualizer } from './components/core/AudioVisualizer';
import { MicButton } from './components/core/MicButton';
import { ChatContainer } from './components/chat/ChatContainer';
import { StatCard } from './components/dashboard/StatCard';
import { SentimentChart } from './components/dashboard/SentimentChart';
import { WelcomeScreen } from './components/welcome/WelcomeScreen';
import { useSpeechToText } from './hooks/useSpeechToText';
import { useTextToSpeech } from './hooks/useTextToSpeech';
import { useStore } from './store/useStore';
import { sendMessage, getAnalytics } from './services/api';
import { generatePDF } from './utils/pdfGenerator';

const App = () => {
  const {
    sessionId,
    messages,
    audioState,
    sentimentScore,
    showWelcome,
    setAudioState,
    addMessage,
    replaceMessage,
    setCurrentTranscript,
    setSentimentScore,
    analytics,
    setAnalytics,
    setShowWelcome
  } = useStore();

  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    interimTranscript,
    error: speechError
  } = useSpeechToText();

  const { speak, isSpeaking } = useTextToSpeech();

  const [showDashboard, setShowDashboard] = useState(false);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      setShowWelcome(true);
    };

    window.addEventListener('popstate', handlePopState);
    
    // Push initial state if we're not on welcome screen
    if (!showWelcome) {
      window.history.pushState({ page: 'chat' }, '', '');
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Push state when leaving welcome screen
  const handleStartConversation = () => {
    setShowWelcome(false);
    window.history.pushState({ page: 'chat' }, '', '');
  };

  useEffect(() => {
    setCurrentTranscript(interimTranscript);
  }, [interimTranscript, setCurrentTranscript]);

  useEffect(() => {
    if (transcript) {
      handleUserMessage(transcript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  useEffect(() => {
    if (isSpeaking) {
      setAudioState('speaking');
    } else if (isListening) {
      setAudioState('listening');
    } else if (audioState === 'speaking' || audioState === 'listening') {
      setAudioState('idle');
    }
  }, [isListening, isSpeaking]);

  const handleUserMessage = async (content: string) => {
    setAudioState('processing');
    setCurrentTranscript('');

    // Add user message immediately (optimistic update)
    const tempUserMessage = {
      _id: `temp-${Date.now()}`,
      sessionId,
      role: 'user' as const,
      content,
      timestamp: new Date(),
      sentimentScore: 0
    };
    addMessage(tempUserMessage);

    try {
      const deviceType = window.innerWidth < 768 ? 'mobile' : 'desktop';
      const browser = navigator.userAgent;

      const response = await sendMessage(sessionId, content, 'anonymous', deviceType, browser);

      if (response.success) {
        // Replace temp message with actual message from server
        replaceMessage(tempUserMessage._id, response.data.userMessage);
        addMessage(response.data.botMessage);
        setSentimentScore(response.data.sentimentScore);

        speak(response.data.botMessage.content);

        fetchAnalytics();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setAudioState('idle');
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await getAnalytics(sessionId);
      if (response.success) {
        setAnalytics(response.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleExportPDF = () => {
    if (messages.length > 0) {
      generatePDF(messages, sessionId);
    }
  };

  if (showWelcome) {
    return <WelcomeScreen onStart={handleStartConversation} />;
  }

  return (
    <div className="animate-fade-in">
      <Layout>
        <div className="relative h-full">
        {/* Centered Chat Interface */}
        <div className="max-w-4xl mx-auto px-4 h-full flex flex-col">
          <div className="flex flex-col space-y-3 lg:space-y-4 h-full py-4">
            <div className="flex-1 min-h-[300px]">
              <ChatContainer />
            </div>

            <div className="bg-white rounded-lg border border-slate-grey/20 p-3 lg:p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <MicButton
                  isListening={isListening}
                  onClick={handleMicClick}
                  disabled={isSpeaking || audioState === 'processing'}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-deep-charcoal">
                      {audioState === 'listening' && 'Listening...'}
                      {audioState === 'processing' && 'Processing...'}
                      {audioState === 'speaking' && 'Speaking...'}
                      {audioState === 'idle' && 'Click to speak'}
                    </p>
                    {/* Sentiment indicator */}
                    {sentimentScore !== 0 && (
                      <div className={`
                        px-2 py-0.5 rounded-full text-xs font-semibold
                        animate-in fade-in slide-in-from-right-2 duration-300
                        ${sentimentScore > 0.3 ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-200' : 
                          sentimentScore < -0.3 ? 'bg-amber-100 text-amber-700 ring-2 ring-amber-200' : 
                          'bg-gray-100 text-gray-700 ring-2 ring-gray-200'}
                      `}>
                        <span className="inline-block transition-transform duration-300">
                          {sentimentScore > 0 ? '😊' : sentimentScore < 0 ? '😔' : '😐'}
                        </span>
                        {' '}{sentimentScore.toFixed(2)}
                      </div>
                    )}
                  </div>
                  {/* Compact inline visualizer */}
                  <div className="h-10 bg-soft-paper rounded-lg overflow-hidden">
                    <AudioVisualizer isActive={isListening} />
                  </div>
                  {speechError && (
                    <p className="text-muted-red text-xs mt-1">{speechError}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDashboard(!showDashboard)}
                    className="px-4 py-2 text-sm bg-deep-charcoal text-white rounded-lg hover:bg-intl-orange transition-colors duration-200">
                    {showDashboard ? 'Hide Stats' : 'Show Stats'}
                  </button>
                  <button
                    onClick={handleExportPDF}
                    disabled={messages.length === 0}
                    className="px-4 py-2 text-sm bg-deep-charcoal text-white rounded-lg hover:bg-intl-orange transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-deep-charcoal">
                    Export PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

        {/* Sliding Analytics Panel */}
        <div 
          className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
            showDashboard ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="h-full flex flex-col">
            {/* Panel Header */}
            <div className="bg-deep-charcoal text-white p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
              <button
                onClick={() => setShowDashboard(false)}
                className="text-white hover:text-intl-orange transition-colors p-1"
                aria-label="Close analytics"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-soft-paper">
              {analytics ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <StatCard
                      title="User Queries"
                      value={analytics.totalQueries}
                      subtitle="Total queries"
                    />
                    <StatCard
                      title="Avg Response"
                      value={analytics.avgResponseTime >= 1000 ? `${(analytics.avgResponseTime / 1000).toFixed(1)}s` : `${analytics.avgResponseTime}ms`}
                      subtitle="Response time"
                    />
                    <StatCard
                      title="Fastest"
                      value={analytics.fastestResponse >= 1000 ? `${(analytics.fastestResponse / 1000).toFixed(1)}s` : `${analytics.fastestResponse}ms`}
                      subtitle="Best response"
                    />
                    <StatCard
                      title="Slowest"
                      value={analytics.slowestResponse >= 1000 ? `${(analytics.slowestResponse / 1000).toFixed(1)}s` : `${analytics.slowestResponse}ms`}
                      subtitle="Worst response"
                    />
                    <StatCard
                      title="Error Rate"
                      value={`${analytics.errorRate}%`}
                      subtitle={`${analytics.errorCount} errors`}
                    />
                    <StatCard
                      title="Messages"
                      value={analytics.messageCount}
                      subtitle="Completed"
                    />
                    <StatCard
                      title="Sentiment"
                      value={analytics.avgSentiment.toFixed(2)}
                      subtitle="Average mood"
                    />
                    <StatCard
                      title="Duration"
                      value={analytics.sessionDuration >= 60 ? `${Math.floor(analytics.sessionDuration / 60)}m ${analytics.sessionDuration % 60}s` : `${analytics.sessionDuration}s`}
                      subtitle="Session time"
                    />
                  </div>

                  {analytics.sentimentTrend.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold text-deep-charcoal200 mb-3">Sentiment Trend</h3>
                      <SentimentChart data={analytics.sentimentTrend} />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-grey400">
                  <p>No analytics data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Backdrop when panel is open */}
        {showDashboard && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setShowDashboard(false)}
          />
        )}
      </div>
        </div>
      </Layout>
    </div>
  );
};

export default App;
