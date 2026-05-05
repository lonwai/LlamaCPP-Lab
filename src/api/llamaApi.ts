import type { Message, ChatSettings, ChatMetrics } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8080/v1';

export async function* chatCompletionStream(
  messages: Message[],
  settings: ChatSettings
): AsyncGenerator<{ content?: string; reasoning_content?: string; metrics?: ChatMetrics }> {
  const response = await fetch(`${API_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama',
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      stream: true,
      ...settings,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';
  let firstTokenTime: number | null = null;
  let tokenCount = 0;
  let startTime = Date.now();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // 立即解码并分割，不等待累积
    const text = decoder.decode(value, { stream: true });
    const lines = text.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data: ')) continue;
      
      const data = trimmed.slice(6);
      if (data === '[DONE]') continue;

      try {
        const parsed = JSON.parse(data);
        const delta = parsed.choices?.[0]?.delta || {};
        const content = delta.content || '';
        const reasoningContent = delta.reasoning_content || '';
        
        const timings = parsed.timings || {};
        
        // 只要有内容就立即 yield（收到即渲染）
        if (content || reasoningContent) {
          if (firstTokenTime === null) {
            firstTokenTime = Date.now();
          }
          if (content) tokenCount++;
          if (reasoningContent) tokenCount++;
          
          const currentTime = Date.now();
          const elapsed = (currentTime - startTime) / 1000;
          
          yield {
            content: content || undefined,
            reasoning_content: reasoningContent || undefined,
            metrics: {
              ttft: firstTokenTime ? firstTokenTime - startTime : undefined,
              tokensPerSecond: tokenCount / elapsed,
              totalTokens: tokenCount,
              promptTokens: timings.prompt_n,
              completionTokens: timings.predicted_n,
            },
          };
        }
      } catch (e) {
        // 忽略单个 chunk 解析错误，继续处理后续数据
        if (trimmed) {
          console.warn('Failed to parse SSE chunk:', trimmed.substring(0, 50));
        }
      }
    }
  }
}
