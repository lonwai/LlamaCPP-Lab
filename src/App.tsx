import { useState } from 'react';
import { useChatStore } from './store/chatStore';
import { useChatStream } from './hooks/useChatStream';
import { MetricsCards } from './components/Metrics/MetricsCards';
import { MetricsChart } from './components/Metrics/MetricsChart';
import { Header } from './components/Layout/Header';
import { ConversationList } from './components/Chat/ConversationList';
import { SettingsPanel } from './components/Settings/SettingsPanel';
import { useTheme } from './hooks/useTheme';
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
  const [showSettings, setShowSettings] = useState(false);
  const [showConversationList, setShowConversationList] = useState(true);
  const [showMetricsPanel, setShowMetricsPanel] = useState(true);
  useTheme();
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
      <Header
        showConversationList={showConversationList}
        showMetricsPanel={showMetricsPanel}
        onToggleConversationList={() => setShowConversationList(v => !v)}
        onToggleMetricsPanel={() => setShowMetricsPanel(v => !v)}
      />

      <div className="flex flex-1 overflow-hidden relative">
        {/* 最左侧：会话列表侧边栏 */}
        <div className={`transition-all duration-300 overflow-hidden ${showConversationList ? 'w-64' : 'w-0'}`}>
          <ConversationList />
        </div>

        {/* 中间：对话区域 */}
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
            {isSending && <div className="text-center text-gray-500 dark:text-gray-400 animate-pulse">生成中...</div>}
            {error && <div className="text-center text-red-500">⚠️ {error}</div>}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
              {/* 参数配置折叠区 */}
              {showSettings && (
                <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                  <SettingsPanel />
                </div>
              )}
              <div className="flex items-center gap-3 mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={enableReasoning} onChange={(e) => setEnableReasoning(e.target.checked)} className="w-4 h-4" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">🧠 深度思考</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowSettings(v => !v)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    showSettings
                      ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  ⚙️ 参数
                </button>
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
        <aside className={`transition-all duration-300 overflow-hidden border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 ${showMetricsPanel ? 'w-80' : 'w-0'}`}>
          <div className="w-80 h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">📊 实时性能监控</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <MetricsCards />
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">📈 趋势分析</h4>
                <MetricsChart />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
