import { useState } from 'react';
import { useChatStore } from './store/chatStore';
import { useChatStream } from './hooks/useChatStream';
import { MetricsCards } from './components/Metrics/MetricsCards';
import { Header } from './components/Layout/Header';
import { MessageBubble } from './components/Chat/MessageBubble';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [enableReasoning, setEnableReasoning] = useState(false);
  const { messages } = useChatStore();
  const { sendMessage, error, isSending } = useChatStream();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;
    
    await sendMessage(input, enableReasoning);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <MetricsCards />

      <main className="max-w-4xl mx-auto p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow min-h-[500px] flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-20">
                开始与本地模型对话吧！
              </div>
            ) : (
              messages.map((msg, index) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isLast={index === messages.length - 1}
                />
              ))
            )}
            {isSending && !messages.some(m => m.role === 'assistant' && !m.content) && (
              <div className="text-center text-gray-500">
                <div className="flex items-center justify-center gap-2">
                  <span className="animate-pulse">思考中</span>
                  <span className="flex gap-1">
                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </span>
                </div>
              </div>
            )}
            {error && (
              <div className="text-center text-red-500">{error}</div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t p-4 space-y-3">
            {/* 思考模式开关 */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={enableReasoning}
                onChange={(e) => setEnableReasoning(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                disabled={isSending}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                🧠 开启深度思考模式（需要模型支持）
              </span>
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="输入消息..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                disabled={isSending}
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                发送
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default App;
