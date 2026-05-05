import { useChatStore } from '../../store/chatStore';

export function MetricsCards() {
  const metrics = useChatStore(state => state.metrics);

  if (!metrics) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="p-3 bg-white dark:bg-gray-700 rounded shadow">
        <div className="text-sm text-gray-500 dark:text-gray-400">首字延迟</div>
        <div className="text-2xl font-bold text-blue-600">
          {metrics.ttft ? `${Math.round(metrics.ttft)}ms` : '-'}
        </div>
      </div>

      <div className="p-3 bg-white dark:bg-gray-700 rounded shadow">
        <div className="text-sm text-gray-500 dark:text-gray-400">生成速度</div>
        <div className="text-2xl font-bold text-green-600">
          {metrics.tokensPerSecond ? `${metrics.tokensPerSecond.toFixed(1)} t/s` : '-'}
        </div>
      </div>

      <div className="p-3 bg-white dark:bg-gray-700 rounded shadow">
        <div className="text-sm text-gray-500 dark:text-gray-400">总 Token 数</div>
        <div className="text-2xl font-bold text-purple-600">
          {metrics.totalTokens || 0}
        </div>
      </div>

      <div className="p-3 bg-white dark:bg-gray-700 rounded shadow">
        <div className="text-sm text-gray-500 dark:text-gray-400">上下文 Token</div>
        <div className="text-2xl font-bold text-orange-600">
          {(metrics.promptTokens || 0) + (metrics.completionTokens || 0)}
        </div>
      </div>
    </div>
  );
}
