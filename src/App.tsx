import { useState } from 'react';
import { useChatStore } from '../store/chatStore';
import { useChatStream } from '../hooks/useChatStream';
import { MetricsCards } from './components/Metrics/MetricsCards';
import { Header } from './components/Layout/Header';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const { messages } = useChatStore();
  const { sendMessage, error, isSending } = useChatStream();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;
    
    await sendMessage(input);
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
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {isSending && (
              <div className="text-center text-gray-500">思考中...</div>
            )}
            {error && (
              <div className="text-center text-red-500">{error}</div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t p-4">
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
