import { useChatStore } from '../../store/chatStore';

export function MetricsCards() {
  const metrics = useChatStore(state => state.metrics);

  if (!metrics) return null;

  return (
    <div className="flex flex-col gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg h-full overflow-y-auto">
      {/* 首字延迟 */}
      <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded shadow-sm border border-gray-100 dark:border-gray-600">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">首字延迟 (TTFT)</span>
        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
          {metrics.ttft ? `${Math.round(metrics.ttft)}ms` : '-'}
        </span>
      </div>

      {/* 生成速度 */}
      <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded shadow-sm border border-gray-100 dark:border-gray-600">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">生成速度</span>
        <span className="text-xl font-bold text-green-600 dark:text-green-400">
          {metrics.tokensPerSecond ? `${metrics.tokensPerSecond.toFixed(1)} t/s` : '-'}
        </span>
      </div>

      {/* 总 Token 数 */}
      <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded shadow-sm border border-gray-100 dark:border-gray-600">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">总 Token 数</span>
        <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
          {metrics.totalTokens || 0}
        </span>
      </div>

      {/* 上下文 Token */}
      <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded shadow-sm border border-gray-100 dark:border-gray-600">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">上下文 Token</span>
        <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
          {(metrics.promptTokens || 0) + (metrics.completionTokens || 0)}
        </span>
      </div>
    </div>
  );
}
