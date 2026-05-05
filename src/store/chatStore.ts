import { create } from 'zustand';
import type { Message, Conversation, ChatSettings, ChatMetrics } from '../types';

interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  messages: Message[];
  isLoading: boolean;
  metrics: ChatMetrics | null;
  accumulatedTokens: number; // 新增：多轮对话上下文 Token 累加器
  settings: ChatSettings;
  
  addMessage: (message: Message) => void;
  updateLastMessage: (content: string, reasoning?: string) => void;
  setLoading: (loading: boolean) => void;
  updateMetrics: (metrics: ChatMetrics, isFinal?: boolean) => void; // 新增 isFinal 标记
  createConversation: () => string;
  selectConversation: (id: string) => void;
  saveConversations: () => void;
  loadConversations: () => void;
  resetAccumulatedTokens: () => void; // 新增：新建对话时重置
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
  accumulatedTokens: 0, // 初始化累加器为 0
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

  updateMetrics: (metrics, isFinal = false) => {
    set((state) => {
      // 如果是最终指标（流结束），则累加 Token 数
      if (isFinal && (metrics.promptTokens || metrics.completionTokens)) {
        const currentTotal = metrics.promptTokens || 0; // prompt_n 通常已包含历史上下文
        const newGenerated = metrics.completionTokens || 0;
        // 直接采用后端返回的完整上下文长度作为当前值（因为 prompt_n 随对话轮次增加）
        // 或者如果需要严格累加生成量：accumulated + newGenerated
        return { 
          metrics, 
          accumulatedTokens: currentTotal + newGenerated 
        };
      }
      // 非最终状态只更新实时 metrics，不改变累加器
      return { metrics };
    });
  },

  resetAccumulatedTokens: () => set({ accumulatedTokens: 0 }),

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
      accumulatedTokens: 0, // 新建对话时重置累加器
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
