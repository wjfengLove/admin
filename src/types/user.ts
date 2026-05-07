export interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  avatar?: string;
  email?: string;
  role: string;
  permissions: string[];
}

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResult {
  token: string;
  user: UserInfo;
}

// 用户管理
export interface UserItem {
  id: number;
  username: string;
  nickname: string;
  email: string;
  phone: string;
  role: string;
  status: 0 | 1; // 0=停用 1=启用
  createdAt: string;
}

export interface UserQueryParams {
  username?: string;
  status?: 0 | 1;
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  list: T[];
  total: number;
}

// 系统设置
export interface SystemSettings {
  siteName: string;
  logo?: string;
  description: string;
  recordNumber: string;
  loginRetryLimit: number;
  sessionTimeout: number;
  enableRegister: boolean;
  enableNotification: boolean;
  mailHost: string;
  mailPort: number;
  mailUser: string;
}
