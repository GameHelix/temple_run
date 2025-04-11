export interface Message {
    id: string;
    role: 'user' | 'system';
    content: string;
    timestamp: Date;
  }
  
  export interface ChatResponse {
    message: string;
    sources?: string[];
  }