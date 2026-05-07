import { Typography } from 'antd';
import { RobotOutlined, UserOutlined } from '@ant-design/icons';
import type { ChatMessage } from '@/types/chat';

interface Props {
  message: ChatMessage;
}

export default function MessageBubble({ message }: Props) {
  const isBot = message.role === 'bot';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isBot ? 'flex-start' : 'flex-end',
        marginBottom: 16,
        padding: '0 16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        {isBot ? (
          <>
            <RobotOutlined style={{ color: '#1677ff', fontSize: 14 }} />
            <span style={{ fontSize: 12, color: '#999' }}>智能助手</span>
          </>
        ) : (
          <>
            <span style={{ fontSize: 12, color: '#999' }}>我</span>
            <UserOutlined style={{ color: '#52c41a', fontSize: 14 }} />
          </>
        )}
      </div>
      <div
        style={{
          maxWidth: '90%',
          padding: '10px 14px',
          borderRadius: 12,
          background: isBot ? '#f5f5f5' : '#1677ff',
          color: isBot ? '#333' : '#fff',
          lineHeight: 1.7,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {message.content ? (
          <Typography.Text style={{ color: 'inherit' }}>{message.content}</Typography.Text>
        ) : (
          <span style={{ color: isBot ? '#999' : 'inherit' }}>思考中...</span>
        )}
      </div>
    </div>
  );
}
