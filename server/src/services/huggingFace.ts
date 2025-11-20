import Groq from 'groq-sdk';

let groq: Groq | null = null;

function getGroqClient(): Groq | null {
  if (!process.env.GROQ_API_KEY) {
    return null;
  }
  if (!groq) {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
  }
  return groq;
}

export const generateResponse = async (prompt: string, context: string[] = []): Promise<string> => {
  const client = getGroqClient();
  
  if (!client) {
    console.warn('Groq API key not configured, using fallback responses');
    return getFallbackResponse(prompt);
  }

  try {
    // Build conversation history
    const messages: any[] = [
      {
        role: 'system',
        content: 'You are a helpful, friendly AI assistant. Keep responses concise, conversational, and informative. Answer questions accurately and be supportive.'
      }
    ];

    // Add context if available (last 3 exchanges)
    const recentContext = context.slice(-6);
    for (let i = 0; i < recentContext.length; i += 2) {
      if (recentContext[i]) {
        messages.push({ role: 'user', content: recentContext[i] });
      }
      if (recentContext[i + 1]) {
        messages.push({ role: 'assistant', content: recentContext[i + 1] });
      }
    }

    // Add current prompt
    messages.push({ role: 'user', content: prompt.trim() });

    const chatCompletion = await client.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile', // Fast and capable model
      temperature: 0.7,
      max_tokens: 300,
      top_p: 0.9
    });

    const responseText = chatCompletion.choices[0]?.message?.content || '';
    return responseText.trim() || getFallbackResponse(prompt);
  } catch (error: any) {
    console.error('Groq API error:', error.message);
    return getFallbackResponse(prompt);
  }
};

function getFallbackResponse(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase().trim();
  
  if (lowerPrompt.match(/^(hi|hello|hey|greetings)/)) {
    return "Hello! I'm here to help. What would you like to talk about today?";
  }
  
  if (lowerPrompt.includes('how are you')) {
    return "I'm functioning well, thank you for asking! I'm here to assist you. What can I help you with?";
  }
  
  return "I'm here to help! Please set up your Groq API key in the .env file for full AI capabilities, or ask me something and I'll do my best to assist.";
}
