import { useState, useCallback } from 'react';
import { useChatStore } from '../store/chatStore';
import { chatCompletionStream } from '../api/llamaApi';
import type { Message, ChatMetrics } from '../types';

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
      let finalMetrics: ChatMetrics | null = null;

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
        
        // 实时估算速度 (如果还没有最终数据)
        if (chunk.metrics && !chunk.metrics.promptTokens) {
           updateMetrics(chunk.metrics);
        }
        
        // 捕获最终的完整 metrics (通常在最后一个 chunk)
        if (chunk.metrics && (chunk.metrics.promptTokens || chunk.metrics.completionTokens)) {
          finalMetrics = chunk.metrics;
        }
      }
      
      // 【关键修复】流结束后，强制用最终准确数据刷新一次指标
      if (finalMetrics) {
        updateMetrics(finalMetrics);
      } else if (!finalMetrics && useChatStore.getState().metrics?.totalTokens === 0) {
        // 兜底：如果完全没拿到 metrics，至少根据长度估算一下
        const estimatedTokens = Math.ceil((fullContent.length + fullReasoning.length) / 4);
        updateMetrics({
          totalTokens: estimatedTokens,
          completionTokens: estimatedTokens,
          tokensPerSecond: useChatStore.getState().metrics?.tokensPerSecond || 0
        });
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
