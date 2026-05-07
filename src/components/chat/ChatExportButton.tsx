import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import type { ChatMessage } from '@/types/chat';
import { exportChatAsMarkdown } from '@/utils/exportChat';

interface Props {
  messages: ChatMessage[];
  disabled: boolean;
}

export default function ChatExportButton({ messages, disabled }: Props) {
  return (
    <Button
      size="small"
      icon={<DownloadOutlined />}
      disabled={disabled}
      onClick={() => exportChatAsMarkdown(messages)}
    >
      导出
    </Button>
  );
}
