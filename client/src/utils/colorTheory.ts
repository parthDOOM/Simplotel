export const getColorFromSentiment = (score: number): string => {
  if (score > 0.5) return '#10B981';
  if (score < -0.5) return '#FF8C42';
  return '#FF4F00';
};

export const getSentimentLabel = (score: number): string => {
  if (score > 0.5) return 'Positive';
  if (score < -0.5) return 'Negative';
  return 'Neutral';
};
