export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
}

export interface ChatRequest {
  question: string;
}

export interface ChatResponse {
  answer: string;
  timestamp: string;
}
