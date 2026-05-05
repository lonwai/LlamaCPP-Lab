import type { Message, ChatSettings, ChatMetrics } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8080/v1';

export async function* chatCompletionStream(
  messages: Message[],
  settings: ChatSettings
): AsyncGenerator<{ content?: string; metrics?: ChatMetrics }> {
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

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') continue;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content || '';
          
          const timings = parsed.timings || {};
          
          if (content) {
            if (firstTokenTime === null) {
              firstTokenTime = Date.now();
            }
            tokenCount++;
            
            const currentTime = Date.now();
            const elapsed = (currentTime - startTime) / 1000;
            
            yield {
              content,
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
          console.warn('Failed to parse SSE data:', e);
        }
      }
    }
  }
}
