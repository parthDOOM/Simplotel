import React, { useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';

interface AudioVisualizerProps {
  isActive: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sentimentScore = useStore(state => state.sentimentScore);

  useEffect(() => {
    if (!isActive) {
      stopVisualization();
      return;
    }

    startVisualization();

    return () => {
      stopVisualization();
    };
  }, [isActive]);

  const startVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      draw();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopVisualization = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const draw = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const analyser = analyserRef.current;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const drawFrame = () => {
      animationRef.current = requestAnimationFrame(drawFrame);

      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, width, height);

      // Draw bars instead of wave for better visibility
      const barCount = 64;
      const barWidth = width / barCount;
      const color = getColorFromSentiment(sentimentScore);
      
      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor(i * bufferLength / barCount);
        const value = dataArray[dataIndex];
        const barHeight = (value / 255) * height * 0.8;
        
        const x = i * barWidth;
        const y = height - barHeight;
        
        // Gradient effect
        const gradient = ctx.createLinearGradient(0, y, 0, height);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, color + '80');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
      }
    };

    drawFrame();
  };

  const getColorFromSentiment = (score: number): string => {
    // Positive - shades of blue
    if (score > 0.7) return '#2563EB'; // blue-600
    if (score > 0.5) return '#3B82F6'; // blue-500
    if (score > 0.3) return '#60A5FA'; // blue-400
    
    // Negative - shades of amber/orange
    if (score < -0.7) return '#B45309'; // amber-700
    if (score < -0.5) return '#D97706'; // amber-600
    if (score < -0.3) return '#F59E0B'; // amber-500
    
    // Neutral - default orange
    return '#FF4F00';
  };

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={40}
      className="w-full h-full bg-transparent rounded"
      aria-label="Audio visualization"
    />
  );
};
