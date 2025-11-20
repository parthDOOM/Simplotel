import React, { useEffect, useRef } from 'react';

interface SentimentChartProps {
  data: Array<{ timestamp: Date; score: number }>;
}

export const SentimentChart: React.FC<SentimentChartProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background zones
    // Positive zone (green tint)
    ctx.fillStyle = '#10B98110';
    ctx.fillRect(padding, padding, width - 2 * padding, height / 2 - padding);
    
    // Negative zone (red tint)
    ctx.fillStyle = '#EF444410';
    ctx.fillRect(padding, height / 2, width - 2 * padding, height / 2 - padding);

    // Draw horizontal grid lines
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (height - 2 * padding) * (i / 4);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw center line (0.0) thicker
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height / 2);
    ctx.lineTo(width - padding, height / 2);
    ctx.stroke();

    if (data.length < 1) return;

    const maxPoints = Math.min(data.length, 15);
    const points = data.slice(-maxPoints);
    const xStep = (width - 2 * padding) / Math.max(maxPoints - 1, 1);

    // Draw line
    ctx.strokeStyle = '#FF4F00';
    ctx.lineWidth = 3;
    ctx.beginPath();

    points.forEach((point, index) => {
      const x = padding + index * xStep;
      // Scale: -1 to 1 mapped to height
      const normalizedScore = Math.max(-1, Math.min(1, point.score || 0));
      const y = height / 2 - (normalizedScore * (height / 2 - padding));

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw points with values
    ctx.font = 'bold 10px Inter';
    ctx.textAlign = 'center';
    
    points.forEach((point, index) => {
      const x = padding + index * xStep;
      const normalizedScore = Math.max(-1, Math.min(1, point.score || 0));
      const y = height / 2 - (normalizedScore * (height / 2 - padding));

      // Draw circle
      ctx.fillStyle = point.score > 0 ? '#10B981' : point.score < 0 ? '#EF4444' : '#FF4F00';
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw white border
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw value on every other point to avoid clutter
      if (points.length <= 5 || index % 2 === 0) {
        ctx.fillStyle = '#1F2937';
        const value = (point.score || 0).toFixed(2);
        ctx.fillText(value, x, y - 12);
      }
    });

    // Draw Y-axis labels
    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 12px Inter';
    ctx.textAlign = 'right';
    ctx.fillText('+1.0', padding - 8, padding + 5);
    ctx.fillText('+0.5', padding - 8, padding + (height - 2 * padding) * 0.25 + 5);
    ctx.fillText('0.0', padding - 8, height / 2 + 5);
    ctx.fillText('-0.5', padding - 8, padding + (height - 2 * padding) * 0.75 + 5);
    ctx.fillText('-1.0', padding - 8, height - padding + 5);

    // Draw labels
    ctx.textAlign = 'center';
    ctx.fillStyle = '#6B7280';
    ctx.font = '11px Inter';
    ctx.fillText('Positive →', width / 2, padding - 10);
    ctx.fillText('← Negative', width / 2, height - padding + 20);

  }, [data]);

  return (
    <div className="bg-white rounded-lg border border-slate-grey/20 p-4">
      <canvas
        ref={canvasRef}
        width={600}
        height={250}
        className="w-full"
      />
    </div>
  );
};
