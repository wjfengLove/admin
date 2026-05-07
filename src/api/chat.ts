import request from '@/utils/request';
import type { ChatRequest, ChatResponse } from '@/types/chat';

export function sendMessage(data: ChatRequest) {
  return request.post<never, ChatResponse>('/ai/chat', data);
}
