import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import { findUserById } from './user-db';

// Initialize OpenAI client
// Note: You should use environment variables for the API key in production
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '', // Add your API key to .env.local
});

// Expanded healthcare knowledge base for simple queries
const healthcareKnowledgeBase = {
  // Basic health topics
  'headache': 'Headaches can be caused by stress, dehydration, lack of sleep, or more serious conditions. For occasional headaches, rest, hydration, and over-the-counter pain relievers may help. If headaches are severe, persistent, or accompanied by other symptoms like vision changes or confusion, please consult a healthcare provider.',
  'cold': 'Common cold symptoms include runny nose, sore throat, cough, and mild fever. Rest, fluids, and over-the-counter cold medicines can help manage symptoms. If symptoms worsen or persist beyond 10 days, consider consulting a healthcare provider.',
  'fever': 'Fever is often a sign that your body is fighting an infection. Rest, hydration, and over-the-counter fever reducers may help. For high fevers (above 103°F/39.4°C) or fevers that persist for more than three days, please seek medical attention.',
  'diabetes': 'Diabetes is a chronic condition that affects how your body processes blood sugar. Common symptoms include increased thirst, frequent urination, and fatigue. Management typically involves monitoring blood sugar, medication, healthy eating, and regular exercise. Always consult healthcare providers for proper diagnosis and treatment.',
  'blood pressure': 'Blood pressure measurements include systolic (top number) and diastolic (bottom number) pressures. Normal is generally considered below 120/80 mmHg. Lifestyle changes like regular exercise, healthy diet, limiting sodium, and reducing stress can help manage blood pressure.',
  
  // Additional health topics
  'anxiety': 'Anxiety is a normal response to stress, but when it becomes excessive or persistent, it may be an anxiety disorder. Symptoms can include excessive worry, restlessness, fatigue, difficulty concentrating, and physical symptoms like rapid heartbeat. Treatment may include therapy, medication, stress management, and lifestyle changes.',
  'depression': 'Depression is a common but serious mood disorder that affects how you feel, think, and handle daily activities. Symptoms may include persistent sadness, loss of interest in activities, changes in appetite or sleep, fatigue, feelings of worthlessness, and thoughts of death. Professional help is important - speak with a healthcare provider.',
  'insomnia': 'Insomnia involves difficulty falling asleep, staying asleep, or both. It can be caused by stress, anxiety, depression, medications, or other health conditions. Improving sleep hygiene, regular exercise, limiting caffeine, and maintaining a consistent sleep schedule may help. For persistent insomnia, consult a healthcare provider.',
  'exercise': 'Regular physical activity offers numerous health benefits, including improved cardiovascular health, stronger muscles and bones, better weight management, reduced risk of chronic diseases, improved mental health, and better sleep. Aim for at least 150 minutes of moderate-intensity activity per week, along with muscle-strengthening activities twice weekly.',
  'nutrition': 'A balanced diet includes a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats. Limit processed foods, added sugars, and excessive sodium. Proper nutrition helps maintain a healthy weight, reduces disease risk, and supports overall wellbeing. Consider consulting a registered dietitian for personalized advice.',
  'covid': 'COVID-19 is caused by the SARS-CoV-2 virus. Symptoms may include fever, cough, fatigue, loss of taste or smell, sore throat, and shortness of breath. If you experience symptoms, consider testing and follow current health guidelines. Vaccinations help prevent serious illness. Consult your healthcare provider for specific advice.',
  'stress': 'Chronic stress can negatively impact physical and mental health. Stress management techniques include regular exercise, meditation, deep breathing, adequate sleep, maintaining social connections, and setting realistic goals. If stress significantly impacts your daily life, consider speaking with a healthcare provider.',
  'migraine': 'Migraines are intense headaches often accompanied by nausea, sensitivity to light and sound, and sometimes visual disturbances. Triggers can include stress, certain foods, hormonal changes, and environmental factors. Treatment may include medications, lifestyle changes, and identifying and avoiding triggers.',
  'allergy': 'Allergies occur when your immune system reacts to substances that are typically harmless. Symptoms vary but may include sneezing, itching, rash, or in severe cases, difficulty breathing. Common allergens include pollen, pet dander, certain foods, and medications. Treatment depends on the allergy type and severity.',
  'vaccination': 'Vaccinations are an important preventive health measure that help protect against serious infectious diseases. They work by stimulating the immune system to recognize and fight specific pathogens. Recommended vaccines vary by age, health status, and location. Consult your healthcare provider about which vaccines are appropriate for you.',
  'pregnancy': 'Pregnancy typically lasts about 40 weeks and is divided into three trimesters. Regular prenatal care is essential for monitoring both maternal and fetal health. Common experiences include morning sickness, fatigue, and physical changes. Maintain a healthy diet, stay physically active as advised by your healthcare provider, and avoid substances like alcohol and tobacco.',
  'heart disease': 'Heart disease encompasses various conditions affecting heart function. Risk factors include high blood pressure, high cholesterol, smoking, obesity, diabetes, and family history. Prevention strategies include regular exercise, healthy diet, not smoking, maintaining healthy weight, and regular health check-ups. Early detection and treatment are important.',
  'mental health': 'Mental health is as important as physical health and affects how we think, feel, and act. It influences how we handle stress, relate to others, and make choices. Common disorders include depression, anxiety, bipolar disorder, and PTSD. Professional help is available and effective. Reach out to a healthcare provider if you are struggling.'
};

// Categories for organizing health topics
const healthCategories = {
  'common_conditions': ['cold', 'fever', 'headache', 'migraine', 'insomnia', 'allergy'],
  'chronic_diseases': ['diabetes', 'heart disease', 'hypertension', 'blood pressure'],
  'mental_health': ['anxiety', 'depression', 'stress', 'mental health'],
  'lifestyle': ['exercise', 'nutrition', 'sleep', 'weight management'],
  'preventive_care': ['vaccination', 'screening', 'checkups', 'prevention'],
  'special_topics': ['pregnancy', 'covid', 'emergency care']
};

// In-memory storage for user conversation history (in a real app, use a database)
const userConversationHistory: Record<string, Array<ChatCompletionMessageParam>> = {};

/**
 * Process a healthcare-related query and return a response
 */
export async function processHealthcareQuery(query: string, userId?: string | null): Promise<string> {
  // Convert query to lowercase for matching
  const lowerQuery = query.toLowerCase();
  
  // Get or initialize user conversation history
  let conversationHistory: Array<ChatCompletionMessageParam> = [];
  if (userId) {
    if (!userConversationHistory[userId]) {
      userConversationHistory[userId] = [];
    }
    conversationHistory = userConversationHistory[userId];
  }
  
  // Check if the query is asking for available topics
  if (lowerQuery.includes('what can you help with') || 
      lowerQuery.includes('what topics') || 
      lowerQuery.includes('what do you know about')) {
    return generateTopicsList();
  }
  
  // Check if query matches any keywords in our knowledge base
  for (const [keyword, response] of Object.entries(healthcareKnowledgeBase)) {
    if (lowerQuery.includes(keyword)) {
      // Add this interaction to conversation history if user is logged in
      if (userId) {
        conversationHistory.push({ role: "user", content: query });
        conversationHistory.push({ role: "assistant", content: response });
        // Keep conversation history to a reasonable size
        if (conversationHistory.length > 20) {
          conversationHistory.splice(0, 2); // Remove oldest exchange
        }
      }
      return response + disclaimerText();
    }
  }
  
  try {
    // If no match in knowledge base, use AI to generate a response
    if (process.env.OPENAI_API_KEY) {
      // Get user information if available
      let userName = '';
      if (userId) {
        const user = await findUserById(userId);
        if (user) {
          userName = user.name;
        }
      }
      
      // Create messages array starting with the system prompt
      const messages: ChatCompletionMessageParam[] = [
        {
          role: "system",
          content: `You are a helpful healthcare assistant. Provide informative but cautious health information, always encouraging proper medical consultation for serious concerns. Never diagnose or prescribe. Include appropriate disclaimers when necessary.${userName ? ` You are talking to ${userName}.` : ''}`
        }
      ];
      
      // Add conversation history if available
      if (conversationHistory.length > 0) {
        messages.push(...conversationHistory);
      }
      
      // Add the current query
      messages.push({ role: "user", content: query });
      
      // Generate a response
      const completion = await openai.chat.completions.create({
        messages,
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        max_tokens: 500,
      });
      
      const aiResponse = completion.choices[0].message.content || fallbackResponse();
      
      // Add this interaction to conversation history if user is logged in
      if (userId) {
        conversationHistory.push({ role: "user", content: query });
        conversationHistory.push({ role: "assistant", content: aiResponse });
        // Keep conversation history to a reasonable size
        if (conversationHistory.length > 20) {
          conversationHistory.splice(0, 2); // Remove oldest exchange
        }
      }
      
      // If AI response doesn't already include a disclaimer, add one
      if (!aiResponse.includes('disclaimer') && !aiResponse.includes('consult')) {
        return aiResponse + disclaimerText();
      }
      
      return aiResponse;
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
 * Generate a formatted list of available health topics
 */
function generateTopicsList(): string {
  let response = "I can provide general information on the following health topics:\n\n";
  
  for (const [category, topics] of Object.entries(healthCategories)) {
    const formattedCategory = category.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    response += `**${formattedCategory}**: `;
    response += topics.map(topic => topic.replace(/\b\w/g, (l) => l.toUpperCase())).join(', ');
    response += '\n\n';
  }
  
  response += "Please note that I provide general health information only. For personalized medical advice, diagnosis, or treatment, please consult with a qualified healthcare professional.";
  
  return response;
}

/**
 * Standard disclaimer text to append to responses
 */
function disclaimerText(): string {
  return "\n\n*Disclaimer: This information is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions regarding a medical condition.*";
}

/**
 * Fallback response when AI is unavailable
 */
function fallbackResponse(): string {
  return "I'm sorry, I don't have specific information about that health topic. For accurate medical advice, please consult with a healthcare professional. Would you like to ask about another health topic?";
}