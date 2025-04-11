import OpenAI from 'openai';

// Initialize OpenAI client
// Note: You should use environment variables for the API key in production
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '', // Add your API key to .env.local
});

// Basic healthcare knowledge base for simple queries
const healthcareKnowledgeBase = {
  'headache': 'Headaches can be caused by stress, dehydration, lack of sleep, or more serious conditions. For occasional headaches, rest, hydration, and over-the-counter pain relievers may help. If headaches are severe or persistent, please consult a healthcare provider.',
  'cold': 'Common cold symptoms include runny nose, sore throat, cough, and mild fever. Rest, fluids, and over-the-counter cold medicines can help manage symptoms. If symptoms worsen or persist beyond 10 days, consider consulting a healthcare provider.',
  'fever': 'Fever is often a sign that your body is fighting an infection. Rest, hydration, and over-the-counter fever reducers may help. For high fevers (above 103°F/39.4°C) or fevers that persist for more than three days, please seek medical attention.',
  'diabetes': 'Diabetes is a chronic condition that affects how your body processes blood sugar. Common symptoms include increased thirst, frequent urination, and fatigue. Management typically involves monitoring blood sugar, medication, healthy eating, and regular exercise. Always consult healthcare providers for proper diagnosis and treatment.',
  'blood pressure': 'Blood pressure measurements include systolic (top number) and diastolic (bottom number) pressures. Normal is generally considered below 120/80 mmHg. Lifestyle changes like regular exercise, healthy diet, limiting sodium, and reducing stress can help manage blood pressure.',
};

/**
 * Process a healthcare-related query and return a response
 */
export async function processHealthcareQuery(query: string): Promise<string> {
  // Convert query to lowercase for matching
  const lowerQuery = query.toLowerCase();
  
  // Check if query matches any keywords in our knowledge base
  for (const [keyword, response] of Object.entries(healthcareKnowledgeBase)) {
    if (lowerQuery.includes(keyword)) {
      return response;
    }
  }
  
  try {
    // If no match in knowledge base, use AI to generate a response
    if (process.env.OPENAI_API_KEY) {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful healthcare assistant. Provide informative but cautious health information, always encouraging proper medical consultation for serious concerns. Never diagnose or prescribe. Include appropriate disclaimers when necessary."
          },
          { role: "user", content: query }
        ],
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        max_tokens: 500,
      });
      
      return completion.choices[0].message.content || fallbackResponse();
    } else {
      // If no API key is configured, use the fallback response
      return fallbackResponse();
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    return fallbackResponse();
  }
}

/**
 * Fallback response when AI is unavailable
 */
function fallbackResponse(): string {
  return "I'm sorry, I don't have specific information about that health topic. For accurate medical advice, please consult with a healthcare professional. Would you like to ask about another health topic?";
}