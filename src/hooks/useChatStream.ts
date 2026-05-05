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

  const sendMessage = useCallback(async (content: string, enableReasoning: boolean = false) => {
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
      let fullReasoning = '';
      let hasReceivedAnyChunk = false;

      for await (const chunk of chatCompletionStream(allMessages, settings, enableReasoning)) {
        // 收到即渲染：分开累加 reasoning_content 和 content
        if (chunk.content || chunk.reasoning_content) {
          hasReceivedAnyChunk = true;
          if (chunk.reasoning_content) {
            fullReasoning += chunk.reasoning_content;
          }
          if (chunk.content) {
            fullContent += chunk.content;
          }
          // 同时更新 reasoning_content 和 content
          updateLastMessage(fullContent, fullReasoning);
        }
        if (chunk.metrics) {
          updateMetrics(chunk.metrics);
        }
      }
      
      // 如果没有任何 chunk 但也没有报错，至少显示一个空响应
      if (!hasReceivedAnyChunk) {
        updateLastMessage('(无响应)', '');
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
