import { useChatStore } from '../../store/chatStore';

export function MetricsCards() {
  const metrics = useChatStore(state => state.metrics);
  const accumulatedTokens = useChatStore(state => state.accumulatedTokens); // 获取累加后的 Token 数

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

      {/* 总 Token 数（累加值） */}
      <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded shadow-sm border border-gray-100 dark:border-gray-600">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">上下文 Token (累计)</span>
        <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
          {accumulatedTokens > 0 ? accumulatedTokens : (metrics.totalTokens || 0)}
        </span>
      </div>

      {/* 当前轮次详情 */}
      <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded shadow-sm border border-gray-100 dark:border-gray-600">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">本轮生成</span>
        <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
          {metrics.completionTokens || 0}
        </span>
      </div>
    </div>
  );
}
