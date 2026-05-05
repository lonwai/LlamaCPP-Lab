interface HeaderProps {
  showConversationList: boolean;
  showMetricsPanel: boolean;
  onToggleConversationList: () => void;
  onToggleMetricsPanel: () => void;
}

export function Header({
  showConversationList,
  showMetricsPanel,
  onToggleConversationList,
  onToggleMetricsPanel,
}: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow px-4 py-3 flex items-center justify-between">
      <button
        onClick={onToggleConversationList}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          showConversationList
            ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        title={showConversationList ? '收起会话列表' : '展开会话列表'}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span className="hidden sm:inline">会话</span>
      </button>

      <h1 className="text-xl font-bold">🦙 LlamaCPP Lab</h1>

      <button
        onClick={onToggleMetricsPanel}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          showMetricsPanel
            ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        title={showMetricsPanel ? '收起监控面板' : '展开监控面板'}
      >
        <span className="hidden sm:inline">监控</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </button>
    </header>
  );
}
