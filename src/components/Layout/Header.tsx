import { useTheme } from '../../hooks/useTheme';

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
  const { theme, setTheme, resolved } = useTheme();

  const cycleTheme = () => {
    const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(next);
  };

  const themeIcon = resolved === 'dark' ? (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );

  const themeLabel = theme === 'system' ? '跟随系统' : theme === 'dark' ? '暗色模式' : '亮色模式';

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

      <h1 className="text-xl font-bold text-gray-800 dark:text-white">🦙 LlamaCPP Lab</h1>

      <div className="flex items-center gap-1">
        <button
          onClick={cycleTheme}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={`当前: ${themeLabel} (点击切换)`}
        >
          {themeIcon}
          <span className="hidden sm:inline text-xs">
            {theme === 'system' ? '🖥️' : ''}
          </span>
        </button>

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
      </div>
    </header>
  );
}
