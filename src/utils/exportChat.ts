import type { ChatMessage } from '@/types/chat';

export function exportChatAsMarkdown(messages: ChatMessage[]): void {
  const lines: string[] = [
    '# 智能助手对话记录',
    `> 导出时间: ${new Date().toLocaleString()}`,
    '',
    '---',
    '',
  ];

  for (const msg of messages) {
    const role = msg.role === 'user' ? '**你**' : '**小智助手**';
    const time = new Date(msg.timestamp).toLocaleTimeString();
    lines.push(`### ${role} (${time})`);
    lines.push('');
    lines.push(msg.content);
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `chat-export-${Date.now()}.md`;
  a.click();
  URL.revokeObjectURL(url);
}
