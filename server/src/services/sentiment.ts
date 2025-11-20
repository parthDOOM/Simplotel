import Groq from 'groq-sdk';

const vader = require('vader-sentiment');

let groq: Groq | null = null;

function getGroqClient(): Groq | null {
  if (!process.env.GROQ_API_KEY) {
    return null;
  }
  if (!groq) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
}

export const analyzeSentiment = async (text: string): Promise<number> => {
  try {
    const client = getGroqClient();
    
    // Try AI-based sentiment analysis first (more accurate)
    if (client) {
      try {
        const response = await client.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'You are a sentiment analyzer. Analyze the emotional tone of the message and respond with ONLY a number between -1.0 (very negative) and 1.0 (very positive). Consider context, sarcasm, and implied meaning. Respond with just the number, nothing else.'
            },
            {
              role: 'user',
              content: `Analyze sentiment: "${text}"`
            }
          ],
          model: 'llama-3.3-70b-versatile',
          temperature: 0.1,
          max_tokens: 10
        });

        const result = response.choices[0]?.message?.content?.trim();
        const score = parseFloat(result || '0');
        
        if (!isNaN(score) && score >= -1 && score <= 1) {
          console.log(`AI Sentiment for "${text}": ${score}`);
          return score;
        }
      } catch (error) {
        console.error('AI sentiment analysis failed, falling back to VADER');
      }
    }
    
    // Fallback to VADER
    const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(text);
    console.log(`VADER Sentiment for "${text}": ${intensity.compound}`);
    return intensity.compound || 0;
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return 0;
  }
};
