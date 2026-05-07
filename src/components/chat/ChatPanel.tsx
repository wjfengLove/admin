import { useState, useRef, useEffect, useCallback } from 'react';
import { Card } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import type { ChatMessage } from '@/types/chat';
import { sendMessage } from '@/api/chat';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import ChatExportButton from './ChatExportButton';

let nextId = 0;
function genId() {
  return `msg_${++nextId}_${Date.now()}`;
}

export default function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: genId(),
      role: 'bot',
      content: '你好！我是智能助手，有什么可以帮你的？',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [streamMsgId, setStreamMsgId] = useState<string | null>(null);

  const streamIdxRef = useRef(0);
  const streamFullRef = useRef('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startStream = useCallback((msgId: string, fullText: string) => {
    streamIdxRef.current = 0;
    streamFullRef.current = fullText;
    setStreamMsgId(msgId);
    setIsStreaming(true);
    setTypingText('');

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      streamIdxRef.current += 1;
      if (streamIdxRef.current > fullText.length) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        setIsStreaming(false);
        setStreamMsgId(null);
        setMessages((prev) =>
          prev.map((m) => (m.id === msgId ? { ...m, content: fullText } : m)),
        );
        return;
      }
      setTypingText(fullText.slice(0, streamIdxRef.current));
    }, 35);
  }, []);

  const handleSend = useCallback(async () => {
    const q = inputValue.trim();
    if (!q || isStreaming) return;
    setInputValue('');

    const userMsg: ChatMessage = {
      id: genId(),
      role: 'user',
      content: q,
      timestamp: new Date().toISOString(),
    };
    const botMsgId = genId();
    const botPlaceholder: ChatMessage = {
      id: botMsgId,
      role: 'bot',
      content: '',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg, botPlaceholder]);

    try {
      const res = await sendMessage({ question: q });
      startStream(botMsgId, res.answer);
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMsgId ? { ...m, content: '抱歉，请求出错，请稍后重试。' } : m,
        ),
      );
      setIsStreaming(false);
    }
  }, [inputValue, isStreaming, startStream]);

  const displayMessages = messages.map((m) => {
    if (m.id === streamMsgId && isStreaming) {
      return { ...m, content: typingText };
    }
    return m;
  });

  return (
    <Card
      title={
        <span>
          <RobotOutlined style={{ marginRight: 8 }} />
          智能助手
        </span>
      }
      extra={
        <ChatExportButton messages={messages} disabled={messages.length <= 1} />
      }
      styles={{ body: { padding: 0 } }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: 460 }}>
        <ChatMessages messages={displayMessages} />
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          disabled={isStreaming}
        />
      </div>
    </Card>
  );
}
