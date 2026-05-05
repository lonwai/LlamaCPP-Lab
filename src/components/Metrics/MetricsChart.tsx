import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useChatStore } from '../../store/chatStore';

export function MetricsChart() {
  const conversations = useChatStore(state => state.conversations);
  const currentConversationId = useChatStore(state => state.currentConversationId);

  const currentConv = conversations.find(c => c.id === currentConversationId);
  const metricsList = currentConv?.metrics || [];

  if (metricsList.length < 2) {
    return (
      <div className="text-center text-xs text-gray-400 dark:text-gray-500 py-4">
        需要至少 2 轮对话才能显示趋势图
      </div>
    );
  }

  const chartData = metricsList.map((m, i) => ({
    round: `第${i + 1}轮`,
    ttft: m.ttft ? Math.round(m.ttft) : undefined,
    speed: m.tokensPerSecond ? parseFloat(m.tokensPerSecond.toFixed(1)) : undefined,
    tokens: m.completionTokens || 0,
  }));

  return (
    <div className="space-y-4">
      {/* 生成速度趋势 */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
          🚀 生成速度 (tokens/s)
        </h4>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis dataKey="round" tick={{ fontSize: 10 }} stroke="#6b7280" />
            <YAxis tick={{ fontSize: 10 }} stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Line
              type="monotone"
              dataKey="speed"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ r: 3, fill: '#22c55e' }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* TTFT 趋势 */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
          ⚡ 首字延迟 TTFT (ms)
        </h4>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis dataKey="round" tick={{ fontSize: 10 }} stroke="#6b7280" />
            <YAxis tick={{ fontSize: 10 }} stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Line
              type="monotone"
              dataKey="ttft"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3, fill: '#3b82f6' }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 每轮生成 Token 数 */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
          📊 每轮生成 Token 数
        </h4>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis dataKey="round" tick={{ fontSize: 10 }} stroke="#6b7280" />
            <YAxis tick={{ fontSize: 10 }} stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Line
              type="monotone"
              dataKey="tokens"
              stroke="#a855f7"
              strokeWidth={2}
              dot={{ r: 3, fill: '#a855f7' }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
