import { useState } from 'react';
import { useChatStore } from './store/chatStore';
import { useChatStream } from './hooks/useChatStream';
import { MetricsCards } from './components/Metrics/MetricsCards';
import { Header } from './components/Layout/Header';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import './App.css';
import type { Message } from './types';

// 消息气泡组件 - 提取到顶层以避免 Hooks 规则违规
function MessageBubble({ msg }: { msg: Message }) {
  const [isReasoningCollapsed, setIsReasoningCollapsed] = useState(true);
  const hasReasoning = msg.reasoning_content && msg.reasoning_content.length > 0;
  const hasContent = msg.content && msg.content.length > 0;

  return (
    <div className="space-y-3">
      {/* 用户消息 */}
      {msg.role === 'user' && (
        <div className="flex justify-end">
          <div className="max-w-[85%] bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-tr-sm shadow-md">
            <p className="whitespace-pre-wrap">{msg.content}</p>
          </div>
        </div>
      )}

      {/* AI 消息 */}
      {msg.role === 'assistant' && (
        <div className="flex justify-start">
          <div className="max-w-[90%] space-y-3">
            {/* 思考过程区域 */}
            {hasReasoning && (
              <div className={`border border-purple-200 dark:border-purple-800 rounded-xl overflow-hidden transition-all duration-300 ${
                hasContent && isReasoningCollapsed ? 'opacity-70' : 'opacity-100'
              }`}>
                <button
                  onClick={() => setIsReasoningCollapsed(!isReasoningCollapsed)}
                  className="w-full flex items-center justify-between px-4 py-2 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🧠</span>
                    <span className="font-semibold text-purple-800 dark:text-purple-200 text-sm">
                      深度思考过程
                    </span>
                  </div>
                  <span className="text-purple-600 dark:text-purple-400 text-sm">
                    {isReasoningCollapsed ? '▶ 展开' : '▼ 收起'}
                  </span>
                </button>
                
                {!isReasoningCollapsed && (
                  <div className="px-4 py-3 bg-white dark:bg-gray-800 border-t border-purple-100 dark:border-purple-800">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                      >
                        {msg.reasoning_content}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 正式回答区域 */}
            {hasContent && (
              <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm shadow-md border border-gray-200 dark:border-gray-700">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {/* 自动收起提示 */}
            {hasReasoning && hasContent && isReasoningCollapsed && (
              <p className="text-xs text-gray-500 dark:text-gray-400 italic ml-2">
                💡 思考过程已自动收起，点击上方"展开"查看完整推理逻辑
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

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
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <Header />

      <div className="flex flex-1 overflow-hidden relative">
        {/* 左侧：对话区域 */}
        <main className="flex-1 flex flex-col min-w-0 border-r border-gray-200 dark:border-gray-700">
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">🦙</div>
                <h2 className="text-xl font-semibold mb-2">LlamaCPP Lab</h2>
                <p>开始与本地模型对话吧！</p>
              </div>
            ) : (
              messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))
            )}
            {isSending && <div className="text-center text-gray-500 animate-pulse">生成中...</div>}
            {error && <div className="text-center text-red-500">⚠️ {error}</div>}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
              <div className="mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={enableReasoning} onChange={(e) => setEnableReasoning(e.target.checked)} className="w-4 h-4" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">🧠 开启深度思考模式</span>
                </label>
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="输入消息..."
                  className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  disabled={isSending}
                />
                <button type="submit" disabled={isSending || !input.trim()} className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50">
                  {isSending ? '发送中...' : '发送'}
                </button>
              </div>
            </form>
          </div>
        </main>

        {/* 右侧：固定指标侧边栏 */}
        <aside className="hidden md:block w-80 bg-gray-50 dark:bg-gray-800/50 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="sticky top-0 p-4 space-y-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">📊 实时性能监控</h3>
            <MetricsCards />
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 text-sm">🚀 Phase 2 即将上线</h4>
              <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
                <li>💾 JSON 文件持久化存储</li>
                <li>📈 Recharts 趋势图表</li>
                <li>⚙️ 参数预设管理</li>
                <li>📤 会话导出/导入</li>
              </ul>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-xs text-yellow-800 dark:text-yellow-300">
                💡 <strong>当前模式：</strong>Phase 1 (内存级)<br/>
                数据刷新后清空，Phase 2 将自动保存至 JSON 文件。
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
