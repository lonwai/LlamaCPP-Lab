export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  reasoning_content?: string;
  timestamp: number;
}

export interface ChatMetrics {
  ttft?: number;
  tokensPerSecond?: number;
  totalTokens?: number;
  promptTokens?: number;
  completionTokens?: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  metrics: ChatMetrics[];
  createdAt: number;
  updatedAt: number;
}

export interface ChatSettings {
  temperature: number;
  max_tokens: number;
  top_p: number;
  stop: string[];
}
