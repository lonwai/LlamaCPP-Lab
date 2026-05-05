import { create } from 'zustand';
import type { Message, Conversation, ChatSettings, ChatMetrics } from '../types';

interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  messages: Message[];
  isLoading: boolean;
  metrics: ChatMetrics | null;
  settings: ChatSettings;
  
  addMessage: (message: Message) => void;
  updateLastMessage: (content: string, reasoning?: string) => void;
  setLoading: (loading: boolean) => void;
  updateMetrics: (metrics: ChatMetrics) => void;
  createConversation: () => string;
  selectConversation: (id: string) => void;
  saveConversations: () => void;
  loadConversations: () => void;
}

const defaultSettings: ChatSettings = {
  temperature: 0.7,
  max_tokens: 2048,
  top_p: 0.9,
  stop: [],
};

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  currentConversationId: null,
  messages: [],
  isLoading: false,
  metrics: null,
  settings: defaultSettings,

  addMessage: (message) => {
    set((state) => {
      const newMessages = [...state.messages, message];
      return { messages: newMessages };
    });
  },

  updateLastMessage: (content, reasoning = '') => {
    set((state) => {
      const messages = [...state.messages];
      if (messages.length > 0) {
        messages[messages.length - 1] = {
          ...messages[messages.length - 1],
          content,
          reasoning_content: reasoning,
        };
      }
      return { messages };
    });
  },

  setLoading: (loading) => set({ isLoading: loading }),

  updateMetrics: (metrics) => set({ metrics }),

  createConversation: () => {
    const id = crypto.randomUUID();
    const newConversation: Conversation = {
      id,
      title: `对话 ${new Date().toLocaleTimeString()}`,
      messages: [],
      metrics: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    set((state) => ({
      conversations: [...state.conversations, newConversation],
      currentConversationId: id,
      messages: [],
    }));
    
    return id;
  },

  selectConversation: (id) => {
    const conversation = get().conversations.find(c => c.id === id);
    if (conversation) {
      set({
        currentConversationId: id,
        messages: conversation.messages,
      });
    }
  },

  saveConversations: () => {
    console.log('Saving conversations to JSON...');
  },

  loadConversations: () => {
    console.log('Loading conversations from JSON...');
  },
}));
