import { Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
}

export default function ChatInput({ value, onChange, onSend, disabled }: Props) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) onSend();
    }
  };

  return (
    <div style={{ display: 'flex', gap: 8, padding: '12px 16px', borderTop: '1px solid #f0f0f0' }}>
      <Input.TextArea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? '回复中...' : '输入问题，Enter 发送'}
        rows={2}
        autoSize={{ minRows: 2, maxRows: 4 }}
        disabled={disabled}
        style={{ flex: 1 }}
      />
      <Button
        type="primary"
        icon={<SendOutlined />}
        onClick={onSend}
        disabled={disabled || !value.trim()}
        style={{ alignSelf: 'flex-end' }}
      />
    </div>
  );
}
