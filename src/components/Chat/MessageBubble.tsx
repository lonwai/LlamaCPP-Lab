import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';
import type { Message } from '../../types';

interface ReasoningBlockProps {
  content: string;
  isCompleted: boolean;
}

function ReasoningBlock({ content, isCompleted }: ReasoningBlockProps) {
  const [isExpanded, setIsExpanded] = useState(!isCompleted);

  // 当思考完成时自动收起，但允许用户手动展开
  if (!content.trim()) return null;

  return (
    <div className="mb-4 rounded-lg border border-purple-200 dark:border-purple-800 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🧠</span>
          <span className="font-medium text-purple-700 dark:text-purple-300">
            深度思考过程
          </span>
          {!isCompleted && (
            <span className="text-xs text-purple-500 animate-pulse">正在思考...</span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-purple-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-4 py-3 bg-white dark:bg-gray-800 border-t border-purple-100 dark:border-purple-800">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
  isLast: boolean;
}

export function MessageBubble({ message, isLast }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const hasReasoning = message.reasoning_content && message.reasoning_content.trim().length > 0;
  const hasContent = message.content && message.content.trim().length > 0;

  // 判断思考是否已完成（有正式回答或消息不是最后一条）
  const isReasoningCompleted: boolean = !isLast || Boolean(hasContent && hasReasoning);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md ${
          isUser
            ? 'bg-blue-500 text-white'
            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100'
        }`}
      >
        {/* 用户消息直接显示 */}
        {isUser ? (
          <div className="whitespace-pre-wrap">{message.content}</div>
        ) : (
          <>
            {/* AI 消息：如果有思考内容，先显示思考块 */}
            {hasReasoning && (
              <ReasoningBlock
                content={message.reasoning_content!}
                isCompleted={isReasoningCompleted}
              />
            )}

            {/* 正式回答 */}
            {hasContent && (
              <div className={`prose prose-sm dark:prose-invert max-w-none ${hasReasoning ? 'mt-3 pt-3 border-t border-gray-200 dark:border-gray-700' : ''}`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            )}

            {/* 加载中状态 */}
            {!hasContent && !hasReasoning && (
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <span className="animate-pulse">思考中</span>
                <span className="flex gap-1">
                  <span className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </span>
              </div>
            )}
          </>
        )}

        {/* 时间戳 */}
        <div className={`text-xs mt-2 ${isUser ? 'text-blue-100' : 'text-gray-400 dark:text-gray-500'}`}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
