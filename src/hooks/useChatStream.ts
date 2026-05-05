import { useState, useCallback } from 'react';
import { useChatStore } from '../store/chatStore';
import { chatCompletionStream } from '../api/llamaApi';
import type { Message } from '../types';

export function useChatStream() {
  const [error, setError] = useState<string | null>(null);
  const { 
    messages, 
    addMessage, 
    updateLastMessage, 
    setLoading, 
    updateMetrics,
    settings 
  } = useChatStore();

  const sendMessage = useCallback(async (content: string) => {
    setError(null);
    setLoading(true);

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
      const allMessages = [...messages, userMessage];
      let fullContent = '';

      for await (const chunk of chatCompletionStream(allMessages, settings)) {
        if (chunk.content) {
          fullContent += chunk.content;
          updateLastMessage(fullContent);
        }
        if (chunk.metrics) {
          updateMetrics(chunk.metrics);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '发送失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [messages, settings, addMessage, updateLastMessage, setLoading, updateMetrics]);

  return { sendMessage, error, isSending: useChatStore(state => state.isLoading) };
}
