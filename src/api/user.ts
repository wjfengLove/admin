import request from '@/utils/request';
import type {
  LoginParams,
  LoginResult,
  UserInfo,
  UserItem,
  UserQueryParams,
  PaginatedResult,
  SystemSettings,
} from '@/types/user';

export function login(data: LoginParams) {
  return request.post<never, LoginResult>('/auth/login', data);
}

export function getUserInfo() {
  return request.get<never, UserInfo>('/user/info');
}

// 用户管理
export function getUserList(params: UserQueryParams) {
  return request.get<never, PaginatedResult<UserItem>>('/users', { params });
}

export function createUser(data: Partial<UserItem>) {
  return request.post<never, UserItem>('/users', data);
}

export function updateUser(id: number, data: Partial<UserItem>) {
  return request.put<never, UserItem>(`/users/${id}`, data);
}

export function deleteUser(id: number) {
  return request.delete(`/users/${id}`);
}

// 系统设置
export function getSettings() {
  return request.get<never, SystemSettings>('/settings');
}

export function updateSettings(data: Partial<SystemSettings>) {
  return request.put<never, SystemSettings>('/settings', data);
}
