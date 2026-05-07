import request from '@/utils/request';
import type { OrderItem, OrderQueryParams } from '@/types/order';
import type { PaginatedResult } from '@/types/user';

export function getOrderList(params: OrderQueryParams) {
  return request.get<never, PaginatedResult<OrderItem>>('/orders', { params });
}

export function updateOrderStatus(id: number, status: OrderItem['status']) {
  return request.put<never, OrderItem>(`/orders/${id}`, { status });
}

export function getOrderDetail(id: number) {
  return request.get<never, OrderItem>(`/orders/${id}`);
}
