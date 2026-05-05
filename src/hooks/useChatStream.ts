import { useState, useCallback, useEffect } from 'react';
import { useChatStore } from '../store/chatStore';
import { chatCompletionStream } from '../api/llamaApi';
import { saveBenchmark } from '../utils/storage';
import type { Message, ChatMetrics } from '../types';

export function useChatStream() {
  const [error, setError] = useState<string | null>(null);

  const {
    messages,
    addMessage,
    updateLastMessage,
    setLoading,
    updateMetrics,
    settings,
    conversations,
    currentConversationId,
    createConversation,
    saveConversations: saveConversationsToStore,
    loadConversations: loadConversationsFromStore,
    loadSettings: loadSettingsFromStore
  } = useChatStore();

  useEffect(() => {
    loadConversationsFromStore();
    loadSettingsFromStore();
  }, [loadConversationsFromStore, loadSettingsFromStore]);

  useEffect(() => {
    if (conversations.length > 0) {
      saveConversationsToStore();
    }
  }, [conversations, saveConversationsToStore]);

  const isSending = useChatStore(state => state.isLoading);

  const sendMessage = useCallback(async (content: string, enableReasoning: boolean = false) => {
    setError(null);
    setLoading(true);

    let conversationId = currentConversationId;
    if (!conversationId) {
      conversationId = createConversation();
      console.log('🆕 Created new conversation:', conversationId);
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };
    addMessage(userMessage);

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };
    addMessage(assistantMessage);

    try {
      const currentMessages = [...messages, userMessage];

      let fullContent = '';
      let fullReasoning = '';
      let finalMetrics: ChatMetrics | null = null;

      const stream = chatCompletionStream(currentMessages, settings, enableReasoning);

      for await (const chunk of stream) {
        if (chunk.content) {
          fullContent += chunk.content;
          updateLastMessage(fullContent, fullReasoning);
        }
        if (chunk.reasoning_content) {
          fullReasoning += chunk.reasoning_content;
          updateLastMessage(fullContent, fullReasoning);
        }
        if (chunk.metrics) {
          updateMetrics(chunk.metrics);
          finalMetrics = chunk.metrics;
        }
      }

      if (finalMetrics) {
        updateMetrics(finalMetrics, true);

        const conv = useChatStore.getState().conversations.find(c => c.id === conversationId);
        saveBenchmark({
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          conversationTitle: conv?.title || '未知对话',
          roundIndex: conv ? conv.metrics.length : 0,
          metrics: finalMetrics,
          settings,
        });
      } else if (!finalMetrics && useChatStore.getState().metrics?.totalTokens === 0) {
        setError('未收到有效响应，请检查 llama-server 是否正在运行。');
      }

    } catch (err: any) {
      setError(err.message || '请求失败');
    } finally {
      setLoading(false);
    }
  }, [messages, settings, addMessage, updateLastMessage, setLoading, updateMetrics, saveConversationsToStore, currentConversationId, createConversation]);

  return {
    sendMessage,
    error,
    isSending,
  };
}
