'use client';

import { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import { Message } from '@/types/chat';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function ChatInterface() {
  const { user } = useAuth();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'system',
      content: user 
        ? `Hello ${user.name}! I'm your healthcare assistant. How can I help you today?` 
        : `Hello! I'm your healthcare assistant. How can I help you today?`,
      timestamp: new Date(),
    },
    {
      id: '2',
      role: 'system',
      content: 'You can ask me about common health conditions, preventive care, lifestyle topics, mental health, and more. Type "What can you help with?" to see all available topics.',
      timestamp: new Date(),
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([
    'What can you help with?',
    'Tell me about anxiety',
    'How can I improve my sleep?',
    'What are symptoms of COVID-19?'
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update welcome message when user logs in
  useEffect(() => {
    if (messages.length === 2 && messages[0].role === 'system') {
      setMessages([
        {
          id: '1',
          role: 'system',
          content: user 
            ? `Hello ${user.name}! I'm your healthcare assistant. How can I help you today?` 
            : `Hello! I'm your healthcare assistant. How can I help you today?`,
          timestamp: new Date(),
        },
        {
          id: '2',
          role: 'system',
          content: 'You can ask me about common health conditions, preventive care, lifestyle topics, mental health, and more. Type "What can you help with?" to see all available topics.',
          timestamp: new Date(),
        }
      ]);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent, submittedText?: string) => {
    e.preventDefault();
    
    const messageText = submittedText || input;
    if (!messageText.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Get auth token if user is logged in
      const token = localStorage.getItem('auth_token');
      
      // Send message to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ 
          message: messageText,
          userId: user?.id
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response');
      }
      
      const data = await response.json();
      
      // Add AI response
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: 'system',
        content: data.message,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      
      // Update suggestions based on the conversation
      updateSuggestions(messageText, data.message);
    } catch (error) {
      console.error('Error:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'system',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Update suggested questions based on conversation context
  const updateSuggestions = (userMessage: string, aiResponse: string) => {
    const lowerUserMsg = userMessage.toLowerCase();
    const lowerAiResp = aiResponse.toLowerCase();
    
    // If user asked about a specific condition
    if (lowerUserMsg.includes('diabetes')) {
      setSuggestions([
        'How can I manage diabetes?',
        'What are diabetes risk factors?',
        'Tell me about diabetes complications',
        'Is diabetes hereditary?'
      ]);
    } 
    else if (lowerUserMsg.includes('stress') || lowerUserMsg.includes('anxiety')) {
      setSuggestions([
        'How can I reduce stress naturally?',
        'What are symptoms of anxiety?',
        'Tell me about meditation techniques',
        'How does stress affect sleep?'
      ]);
    }
    else if (lowerUserMsg.includes('exercise') || lowerUserMsg.includes('fitness')) {
      setSuggestions([
        'What exercise is best for beginners?',
        'How much exercise do I need per week?',
        'Is walking good exercise?',
        'How does exercise help mental health?'
      ]);
    }
    else if (lowerUserMsg.includes('diet') || lowerUserMsg.includes('nutrition')) {
      setSuggestions([
        'What foods are heart-healthy?',
        'Tell me about the Mediterranean diet',
        'How much water should I drink daily?',
        'What vitamins should I take?'
      ]);
    }
    else if (lowerAiResp.includes('consult') || lowerAiResp.includes('see a doctor')) {
      setSuggestions([
        'When should I go to emergency room?',
        'How to find a specialist doctor?',
        'What questions to ask my doctor?',
        'What can you help with?'
      ]);
    }
    else {
      // Default suggestions
      setSuggestions([
        'What can you help with?',
        'Tell me about preventive healthcare',
        'How can I improve my sleep?',
        'What are common cold remedies?'
      ]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSubmit(new Event('click') as unknown as React.FormEvent, suggestion);
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-blue-700 text-sm">
              <span className="font-medium">Tip:</span> {' '}
              <Link href="/auth/signup" className="underline">Create an account</Link> or{' '}
              <Link href="/auth/signin" className="underline">sign in</Link> to save your chat history and receive personalized assistance.
            </p>
          </div>
        )}
        
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isLoading && (
          <div className="flex items-center text-gray-500">
            <div className="animate-pulse flex space-x-1">
              <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
              <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
              <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Suggested questions */}
      <div className="px-4 pt-2 pb-1 flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
            className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
            disabled={isLoading}
          >
            {suggestion}
          </button>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your health question..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}