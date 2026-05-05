import { useChatStore } from '../../store/chatStore';

export function MetricsCards() {
  const metrics = useChatStore(state => state.metrics);
  const accumulatedTokens = useChatStore(state => state.accumulatedTokens);

  if (!metrics) return null;

  const cards = [
    { label: '首字延迟 (TTFT)', value: metrics.ttft ? `${Math.round(metrics.ttft)}ms` : '-', color: 'text-blue-600 dark:text-blue-400' },
    { label: '生成速度', value: metrics.tokensPerSecond ? `${metrics.tokensPerSecond.toFixed(1)} t/s` : '-', color: 'text-green-600 dark:text-green-400' },
    { label: '上下文 Token (累计)', value: String(accumulatedTokens > 0 ? accumulatedTokens : (metrics.totalTokens || 0)), color: 'text-purple-600 dark:text-purple-400' },
    { label: '本轮生成', value: String(metrics.completionTokens || 0), color: 'text-orange-600 dark:text-orange-400' },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {cards.map((card) => (
        <div key={card.label} className="flex flex-col p-2.5 bg-white dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600">
          <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{card.label}</span>
          <span className={`text-lg font-bold ${card.color} mt-0.5`}>{card.value}</span>
        </div>
      ))}
    </div>
  );
}
