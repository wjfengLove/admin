import { useEffect, useRef } from 'react';
import type { ChatMessage } from '@/types/chat';
import MessageBubble from './MessageBubble';

interface Props {
  messages: ChatMessage[];
}

export default function ChatMessages({ messages }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px 0',
        maxHeight: 360,
      }}
    >
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
