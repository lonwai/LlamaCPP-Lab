import { useChatStore } from '../../store/chatStore';

export function ConversationList() {
  const {
    conversations,
    currentConversationId,
    createConversation,
    selectConversation,
    deleteConversation,
  } = useChatStore();

  const sortedConversations = [...conversations].sort(
    (a, b) => b.updatedAt - a.updatedAt
  );

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const getPreview = (conv: typeof conversations[0]) => {
    if (conv.messages.length === 0) return '空对话';
    const lastMsg = conv.messages[conv.messages.length - 1];
    const text = lastMsg.role === 'user' ? lastMsg.content : lastMsg.content;
    return text.length > 30 ? text.slice(0, 30) + '...' : text;
  };

  return (
    <aside className="w-64 bg-gray-50 dark:bg-gray-800/80 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full shrink-0">
      {/* 新建对话按钮 */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => createConversation()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新建对话
        </button>
      </div>

      {/* 对话列表 */}
      <div className="flex-1 overflow-y-auto">
        {sortedConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 px-4 text-center">
            <span className="text-3xl mb-2">💬</span>
            <p className="text-xs">暂无对话记录</p>
            <p className="text-xs mt-1">点击上方按钮开始新对话</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {sortedConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => selectConversation(conv.id)}
                className={`group relative flex flex-col px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 ${
                  conv.id === currentConversationId
                    ? 'bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 border border-transparent'
                }`}
              >
                {/* 对话标题 */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-medium truncate flex-1 mr-1 ${
                      conv.id === currentConversationId
                        ? 'text-blue-800 dark:text-blue-200'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {conv.title}
                  </span>
                  {/* 删除按钮 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-all shrink-0"
                    title="删除对话"
                  >
                    <svg
                      className="w-3.5 h-3.5 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                {/* 预览文本 */}
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                  {getPreview(conv)}
                </p>

                {/* 底部信息 */}
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">
                    {formatTime(conv.updatedAt)}
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">
                    {conv.messages.length} 条消息
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 底部统计 */}
      {conversations.length > 0 && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            共 {conversations.length} 个对话
          </span>
        </div>
      )}
    </aside>
  );
}
