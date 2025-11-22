import { useState, useEffect, useRef } from 'react';

interface UseTextToSpeechReturn {
  speak: (text: string, language?: string) => void;
  isSpeaking: boolean;
  stop: () => void;
  error: string | null;
}

export const useTextToSpeech = (): UseTextToSpeechReturn => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setError('Text-to-speech is not supported in this browser');
      return;
    }

    synthRef.current = window.speechSynthesis;
    
    // Load voices (they may not be immediately available)
    const loadVoices = () => {
      const voices = synthRef.current?.getVoices() || [];
      if (voices.length > 0) {
        console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
      }
    };
    
    // Load voices immediately
    loadVoices();
    
    // Listen for voices changed event (some browsers need this)
    if (synthRef.current) {
      synthRef.current.addEventListener('voiceschanged', loadVoices);
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
        synthRef.current.removeEventListener('voiceschanged', loadVoices);
      }
    };
  }, []);

  const speak = (text: string, language: string = 'en-US') => {
    if (!synthRef.current) {
      setError('Speech synthesis not available');
      return;
    }

    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    const voices = synthRef.current.getVoices();
    
    // Extract language code (e.g., 'hi' from 'hi-IN', 'gu' from 'gu-IN')
    const langCode = language.split('-')[0];
    
    // Try to find a voice that matches the language
    let preferredVoice = voices.find(
      (voice: SpeechSynthesisVoice) => voice.lang.startsWith(langCode)
    );
    
    // If no voice found for the language, try Google/Microsoft voices
    if (!preferredVoice) {
      console.warn(`No ${language} voice found, trying Google/Microsoft voices`);
      preferredVoice = voices.find(
        (voice: SpeechSynthesisVoice) => voice.name.includes('Google') || voice.name.includes('Microsoft')
      );
    }
    
    // Final fallback to first available voice
    if (!preferredVoice) {
      console.warn('Using default voice');
      preferredVoice = voices[0];
    }
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
      utterance.lang = preferredVoice.lang || language;
      console.log('Using voice:', preferredVoice.name, 'for language:', language);
    }

    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setError(null);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setError(`Speech synthesis error: ${event.error}`);
      setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);
  };

  const stop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  return {
    speak,
    isSpeaking,
    stop,
    error
  };
};
