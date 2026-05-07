import type { UserItem, SystemSettings, LoginResult, PaginatedResult, UserInfo } from '@/types/user';
import type { OrderItem } from '@/types/order';
import type { ArticleItem } from '@/types/article';

const mockUserInfo: UserInfo = {
  id: 1,
  username: 'admin',
  nickname: '管理员',
  email: 'admin@example.com',
  role: 'admin',
  permissions: ['dashboard', 'user:list', 'user:create', 'user:update', 'user:delete', 'settings'],
};

const users: UserItem[] = Array.from({ length: 36 }, (_, i) => ({
  id: i + 1,
  username: i === 0 ? 'admin' : `user_${String(i + 1).padStart(2, '0')}`,
  nickname: i === 0 ? '管理员' : `用户${i + 1}`,
  email: i === 0 ? 'admin@example.com' : `user${i + 1}@example.com`,
  phone: i === 0 ? '13800000000' : `138${String(i + 1).padStart(8, '0')}`,
  role: i === 0 ? 'admin' : i < 5 ? 'editor' : 'viewer',
  status: (i % 5 === 0 ? 0 : 1) as 0 | 1,
  createdAt: `2025-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}T08:00:00Z`,
}));

let mockSettings: SystemSettings = {
  siteName: 'Admin 管理系统',
  logo: '',
  description: '基于 React + TypeScript + Ant Design 构建的后台管理系统',
  recordNumber: '粤ICP备20250001号',
  loginRetryLimit: 5,
  sessionTimeout: 30,
  enableRegister: false,
  enableNotification: true,
  mailHost: 'smtp.example.com',
  mailPort: 465,
  mailUser: 'noreply@example.com',
};

const statuses: OrderItem['status'][] = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];
const payments: OrderItem['paymentMethod'][] = ['wechat', 'alipay', 'card', 'cash'];
const products = ['笔记本电脑', '无线耳机', '机械键盘', '显示器', '鼠标垫', '手机壳', '充电器', '数据线', '平板电脑', '智能手表'];

const orders: OrderItem[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  orderNo: `ORD${String(Date.now()).slice(-8)}${String(i + 1).padStart(4, '0')}`,
  customerName: `客户${i + 1}`,
  phone: `138${String(i + 1).padStart(8, '0')}`,
  product: products[i % products.length],
  amount: parseFloat((Math.random() * 9000 + 100).toFixed(2)),
  status: statuses[i % statuses.length],
  paymentMethod: payments[i % payments.length],
  createdAt: `2025-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}T${String((i % 24)).padStart(2, '0')}:00:00Z`,
  remark: i % 7 === 0 ? '请尽快发货' : '',
}));

const categories = ['技术', '产品', '运营', '设计', '其他'];
const articleStatuses: ArticleItem['status'][] = ['published', 'published', 'published', 'draft', 'archived'];

const articles: ArticleItem[] = Array.from({ length: 45 }, (_, i) => ({
  id: i + 1,
  title: `${['React 18 新特性','TypeScript 高级技巧','Ant Design 主题定制','Vite 性能优化','Zustand 状态管理','CSS Modules 最佳实践','前端工程化实践','微前端架构设计','Node.js 性能调优','Git 工作流规范','Webpack vs Vite','Docker 部署指南','CI/CD 流水线','前端监控体系','错误边界处理'][i % 15]}（第${i + 1}期）`,
  category: categories[i % categories.length],
  author: ['管理员', '编辑A', '编辑B'][i % 3],
  status: articleStatuses[i % articleStatuses.length],
  viewCount: Math.floor(Math.random() * 5000 + 100),
  summary: '这是一篇关于前端开发的技术文章摘要，涵盖了相关技术的核心概念、实践案例和注意事项，适合有一定基础的开发者阅读。',
  createdAt: `2025-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}T10:00:00Z`,
  updatedAt: `2025-0${((i % 3) + 7)}-${String((i % 28) + 1).padStart(2, '0')}T14:00:00Z`,
}));

let nextUserId = users.length + 1;

function parseId(url: string): number | null {
  const match = url.match(/\/users\/(\d+)/);
  return match ? Number(match[1]) : null;
}

function getQuery(url: string) {
  const queryStr = url.split('?')[1] || '';
  const params = new URLSearchParams(queryStr);
  return {
    page: Number(params.get('page')) || 1,
    pageSize: Number(params.get('pageSize')) || 10,
    username: params.get('username') || '',
    status: params.get('status') ? (Number(params.get('status')) as 0 | 1) : undefined,
  };
}

const presetQA: Record<string, string> = {
  '你好': '你好！我是智能助手小智，有什么可以帮助你的吗？',
  '你是谁': '我是 Admin 管理系统的智能助手，可以帮你快速了解系统功能、查询数据、解答常见问题。随时向我提问吧！',
  '系统功能':
    '当前系统支持以下功能：\n\n1. **用户管理** — 查看和管理系统用户，支持增删改查和角色分配\n2. **系统设置** — 配置站点参数，包括基本设置、安全策略和通知服务\n3. **数据仪表盘** — 查看核心指标，包括用户总数、订单量、文章数和访问量\n4. **智能问答** — 也就是现在这个聊天窗口！\n\n有什么想深入了解的吗？',
  '有什么功能': '当前系统支持以下功能：\n\n1. **用户管理** — 查看和管理系统用户，支持增删改查和角色分配\n2. **系统设置** — 配置站点参数，包括基本设置、安全策略和通知服务\n3. **数据仪表盘** — 查看核心指标，包括用户总数、订单量、文章数和访问量\n4. **智能问答** — 也就是现在这个聊天窗口！',
  '谢谢': '不客气！如果还有其他问题，随时找我哦。',
  '帮助': '你可以问我以下方面的问题：\n\n- 系统功能介绍\n- 用户管理相关问题\n- 数据统计和指标查询\n- 系统设置和配置\n\n直接输入问题，我会尽力为你解答！',
};

export function getMockResponse(url: string, method: string, data?: unknown): unknown {
  const path = url.replace(/^\/api/, '');

  // 延迟模拟
  const delay = () => new Promise((r) => setTimeout(r, 300 + Math.random() * 400));

  // POST /auth/login
  if (method === 'POST' && path === '/auth/login') {
    const body = data as { username: string; password: string };
    if (body.username === 'admin' && body.password === 'admin123') {
      return delay().then(() => ({
        token: 'mock-token-' + Date.now(),
        user: mockUserInfo,
      } as LoginResult));
    }
    return Promise.reject({ response: { status: 401, data: { message: '用户名或密码错误' } } });
  }

  // GET /user/info
  if (method === 'GET' && path === '/user/info') {
    return delay().then(() => ({ ...mockUserInfo }));
  }

  // GET /users
  if (method === 'GET' && path.startsWith('/users')) {
    const { page, pageSize, username, status } = getQuery(path);
    let filtered = [...users];
    if (username) {
      filtered = filtered.filter((u) => u.username.includes(username));
    }
    if (status !== undefined) {
      filtered = filtered.filter((u) => u.status === status);
    }
    const start = (page - 1) * pageSize;
    const list = filtered.slice(start, start + pageSize);
    return delay().then(() => ({ list, total: filtered.length } as PaginatedResult<UserItem>));
  }

  // POST /users
  if (method === 'POST' && path === '/users') {
    const body = data as Partial<UserItem>;
    const newUser: UserItem = {
      id: nextUserId++,
      username: body.username || '',
      nickname: body.nickname || '',
      email: body.email || '',
      phone: body.phone || '',
      role: body.role || 'viewer',
      status: body.status ?? 1,
      createdAt: new Date().toISOString(),
    };
    users.unshift(newUser);
    return delay().then(() => newUser);
  }

  // PUT /users/:id
  if (method === 'PUT' && path.startsWith('/users/')) {
    const id = parseId(path);
    const idx = users.findIndex((u) => u.id === id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...(data as Partial<UserItem>) };
      return delay().then(() => users[idx]);
    }
    return Promise.reject({ response: { status: 404, data: { message: '用户不存在' } } });
  }

  // DELETE /users/:id
  if (method === 'DELETE' && path.startsWith('/users/')) {
    const id = parseId(path);
    const idx = users.findIndex((u) => u.id === id);
    if (idx !== -1) {
      users.splice(idx, 1);
      return delay().then(() => null);
    }
    return Promise.reject({ response: { status: 404, data: { message: '用户不存在' } } });
  }

  // GET /settings
  if (method === 'GET' && path === '/settings') {
    return delay().then(() => ({ ...mockSettings }));
  }

  // PUT /settings
  if (method === 'PUT' && path === '/settings') {
    mockSettings = { ...mockSettings, ...(data as Partial<SystemSettings>) };
    return delay().then(() => ({ ...mockSettings }));
  }

  // GET /orders
  if (method === 'GET' && path.match(/^\/orders\/\d+$/)) {
    const id = Number(path.match(/\/orders\/(\d+)/)![1]);
    const order = orders.find((o) => o.id === id);
    if (order) return delay().then(() => ({ ...order }));
    return Promise.reject({ response: { status: 404, data: { message: '订单不存在' } } });
  }

  if (method === 'GET' && path === '/orders') {
    const queryStr = path.includes('?') ? path.split('?')[1] : '';
    const params = new URLSearchParams(queryStr);
    const page = Number(params.get('page')) || 1;
    const pageSize = Number(params.get('pageSize')) || 10;
    const orderNo = params.get('orderNo') || '';
    const status = params.get('status') as OrderItem['status'] | null;

    let filtered = [...orders];
    if (orderNo) filtered = filtered.filter((o) => o.orderNo.includes(orderNo));
    if (status) filtered = filtered.filter((o) => o.status === status);

    const start = (page - 1) * pageSize;
    const list = filtered.slice(start, start + pageSize);
    return delay().then(() => ({ list, total: filtered.length } as PaginatedResult<OrderItem>));
  }

  // PUT /orders/:id
  if (method === 'PUT' && path.startsWith('/orders/')) {
    const match = path.match(/\/orders\/(\d+)/);
    if (match) {
      const id = Number(match[1]);
      const idx = orders.findIndex((o) => o.id === id);
      if (idx !== -1) {
        orders[idx] = { ...orders[idx], ...(data as Partial<OrderItem>) };
        return delay().then(() => orders[idx]);
      }
      return Promise.reject({ response: { status: 404, data: { message: '订单不存在' } } });
    }
  }

  // GET /articles
  if (method === 'GET' && path === '/articles') {
    const qs = path.includes('?') ? path.split('?')[1] : '';
    const params = new URLSearchParams(qs);
    const page = Number(params.get('page')) || 1;
    const pageSize = Number(params.get('pageSize')) || 10;
    const title = params.get('title') || '';
    const category = params.get('category') || '';
    const status = params.get('status') as ArticleItem['status'] | null;

    let filtered = [...articles];
    if (title) filtered = filtered.filter((a) => a.title.includes(title));
    if (category) filtered = filtered.filter((a) => a.category === category);
    if (status) filtered = filtered.filter((a) => a.status === status);

    const start = (page - 1) * pageSize;
    const list = filtered.slice(start, start + pageSize);
    return delay().then(() => ({ list, total: filtered.length } as PaginatedResult<ArticleItem>));
  }

  // POST /articles
  if (method === 'POST' && path === '/articles') {
    const body = data as { title: string; category: string; summary: string; status: 'draft' | 'published' };
    const newArticle: ArticleItem = {
      id: articles.length + 1,
      title: body.title,
      category: body.category,
      author: '管理员',
      status: body.status,
      viewCount: 0,
      summary: body.summary,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    articles.unshift(newArticle);
    return delay().then(() => newArticle);
  }

  // PUT /articles/:id
  if (method === 'PUT' && path.startsWith('/articles/')) {
    const match = path.match(/\/articles\/(\d+)/);
    if (match) {
      const id = Number(match[1]);
      const idx = articles.findIndex((a) => a.id === id);
      if (idx !== -1) {
        articles[idx] = { ...articles[idx], ...(data as Partial<ArticleItem>), updatedAt: new Date().toISOString() };
        return delay().then(() => articles[idx]);
      }
      return Promise.reject({ response: { status: 404, data: { message: '文章不存在' } } });
    }
  }

  // DELETE /articles/:id
  if (method === 'DELETE' && path.startsWith('/articles/')) {
    const match = path.match(/\/articles\/(\d+)/);
    if (match) {
      const id = Number(match[1]);
      const idx = articles.findIndex((a) => a.id === id);
      if (idx !== -1) {
        articles.splice(idx, 1);
        return delay().then(() => null);
      }
      return Promise.reject({ response: { status: 404, data: { message: '文章不存在' } } });
    }
  }

  // POST /ai/chat
  if (method === 'POST' && path === '/ai/chat') {
    const body = data as { question: string };
    const q = (body.question || '').trim();
    let answer: string;

    if (presetQA[q]) {
      answer = presetQA[q];
    } else if (q.includes('用户')) {
      answer =
        '用户管理模块支持用户的增删改查操作。您可以前往"用户管理"页面查看完整列表，管理员拥有全部权限，编辑者可以管理内容，观察者仅可查看。当前系统共有36位用户，其中管理员1位、编辑4位，其余为观察者。';
    } else if (q.includes('设置') || q.includes('配置')) {
      answer =
        '系统设置页面可以修改站点名称、Logo、备案号、登录重试次数（默认5次）、会话超时时间（默认30分钟）等参数。管理员可以通过左侧菜单进入"系统设置"页面进行配置。';
    } else if (q.includes('数据') || q.includes('统计') || q.includes('指标')) {
      answer =
        '根据当前仪表盘数据显示：用户总数为12,846人，订单总量8,846单，文章数量1,356篇，总访问量98,342次。系统运行状态正常，各项指标稳中有升，建议关注用户增长趋势和订单转化率。';
    } else {
      answer =
        '这是一个很好的问题！目前我的知识库还在不断学习中。您可以尝试询问关于系统功能、用户管理、数据统计或系统设置相关的问题，我会尽力为您解答。';
    }

    return delay().then(() => ({
      answer,
      timestamp: new Date().toISOString(),
    }));
  }

  return null; // 不匹配的请求继续发往真实后端
}
