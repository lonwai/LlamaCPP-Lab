import { useState, useEffect } from 'react';
import { loadBenchmarks } from '../../utils/storage';
import type { BenchmarkRecord } from '../../types';

export function BenchmarkPanel() {
  const [records, setRecords] = useState<BenchmarkRecord[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    loadBenchmarks().then(data => {
      const sorted = [...data].sort((a, b) => b.timestamp - a.timestamp);
      setRecords(sorted);
    });
  }, []);

  if (records.length === 0) {
    return (
      <div className="text-center text-xs text-gray-400 dark:text-gray-500 py-3">
        暂无测试记录，对话后将自动保存
      </div>
    );
  }

  const displayRecords = expanded ? records : records.slice(0, 5);

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const getSpeedColor = (speed: number) => {
    if (speed >= 40) return 'text-green-600 dark:text-green-400';
    if (speed >= 20) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-2">
      {displayRecords.map((r) => (
        <div
          key={r.id}
          className="p-2.5 bg-white dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600 text-xs space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400 font-medium truncate max-w-[140px]">
              {r.conversationTitle}
            </span>
            <span className="text-gray-400 dark:text-gray-500 shrink-0">
              {formatTime(r.timestamp)}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <div>
              <span className="text-gray-400 dark:text-gray-500">速度</span>
              <div className={`font-bold ${getSpeedColor(r.metrics.tokensPerSecond || 0)}`}>
                {r.metrics.tokensPerSecond ? r.metrics.tokensPerSecond.toFixed(1) : '-'}
              </div>
            </div>
            <div>
              <span className="text-gray-400 dark:text-gray-500">TTFT</span>
              <div className="font-bold text-blue-600 dark:text-blue-400">
                {r.metrics.ttft ? `${Math.round(r.metrics.ttft)}ms` : '-'}
              </div>
            </div>
            <div>
              <span className="text-gray-400 dark:text-gray-500">Token</span>
              <div className="font-bold text-purple-600 dark:text-purple-400">
                {r.metrics.completionTokens || 0}
              </div>
            </div>
          </div>
          <div className="flex gap-2 text-[10px] text-gray-400 dark:text-gray-500">
            <span>T={r.settings.temperature}</span>
            <span>P={r.settings.top_p}</span>
            <span>Max={r.settings.max_tokens}</span>
          </div>
        </div>
      ))}
      {records.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-center text-xs text-blue-600 dark:text-blue-400 hover:underline py-1"
        >
          {expanded ? '收起' : `查看全部 ${records.length} 条记录`}
        </button>
      )}
    </div>
  );
}
