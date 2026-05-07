# Java 后端实现计划

## Context

前端已有一个完整的后台管理系统，当前所有接口走 mock 数据。需要搭建 Java 后端替代 mock，对接所有现有前端接口。

## 技术选型

| 项 | 选择 | 理由 |
|---|------|------|
| 框架 | Spring Boot 3.x | 主流 |
| JDK | Java 17 | LTS |
| 构建 | Maven | 通用 |
| ORM | MyBatis-Plus | 简化 CRUD |
| 数据库 | H2 (内存) | 零配置，开箱即用，开发阶段足够 |
| 认证 | JWT (jjwt) | 与前端 Bearer token 匹配 |
| 安全 | Spring Security | 标准 |

## 前端 API 清单（15个接口）

### 认证模块
| Method | Path | Request | Response |
|--------|------|---------|----------|
| POST | /api/auth/login | `{username, password}` | `{token, user}` |
| GET | /api/user/info | Header: Bearer token | UserInfo |

### 用户管理
| Method | Path | Query Params | Body | Response |
|--------|------|-------------|------|----------|
| GET | /api/users | page, pageSize, username?, status? | — | `{list, total}` |
| POST | /api/users | — | Partial\<UserItem\> | UserItem |
| PUT | /api/users/{id} | — | Partial\<UserItem\> | UserItem |
| DELETE | /api/users/{id} | — | — | void |

### 订单管理
| Method | Path | Query Params | Body | Response |
|--------|------|-------------|------|----------|
| GET | /api/orders | page, pageSize, orderNo?, status? | — | `{list, total}` |
| GET | /api/orders/{id} | — | — | OrderItem |
| PUT | /api/orders/{id} | — | `{status}` | OrderItem |

### 文章管理
| Method | Path | Query Params | Body | Response |
|--------|------|-------------|------|----------|
| GET | /api/articles | page, pageSize, title?, category?, status? | — | `{list, total}` |
| POST | /api/articles | — | ArticleFormData | ArticleItem |
| PUT | /api/articles/{id} | — | Partial\<ArticleFormData\> | ArticleItem |
| DELETE | /api/articles/{id} | — | — | void |

### 系统设置
| Method | Path | Body | Response |
|--------|------|------|----------|
| GET | /api/settings | — | SystemSettings |
| PUT | /api/settings | Partial\<SystemSettings\> | SystemSettings |

### AI 聊天
| Method | Path | Body | Response |
|--------|------|------|----------|
| POST | /api/ai/chat | `{question}` | `{answer, timestamp}` |

## 响应格式

前端 axios 拦截器直接取 `response.data`，所以后端直接返回数据对象：
- 成功：返回 JSON 对象（如 `{list, total}` 或单个实体）
- 失败：返回 `{message: "错误描述"}` + 对应 HTTP 状态码
- 401：`{message: "未登录或 token 已过期"}`

## 目录结构

```
admin-backend/
├── pom.xml
├── src/main/java/com/admin/
│   ├── AdminApplication.java
│   ├── config/
│   │   ├── SecurityConfig.java          # Spring Security 配置
│   │   ├── JwtAuthFilter.java           # JWT 认证过滤器
│   │   └── DataInitializer.java         # 启动时预设数据
│   ├── controller/
│   │   ├── AuthController.java          # /api/auth/*
│   │   ├── UserController.java          # /api/users/*
│   │   ├── OrderController.java         # /api/orders/*
│   │   ├── ArticleController.java       # /api/articles/*
│   │   ├── SettingsController.java      # /api/settings/*
│   │   └── ChatController.java          # /api/ai/chat
│   ├── entity/
│   │   ├── User.java
│   │   ├── Order.java
│   │   ├── Article.java
│   │   └── SystemSetting.java
│   ├── mapper/
│   │   ├── UserMapper.java
│   │   ├── OrderMapper.java
│   │   ├── ArticleMapper.java
│   │   └── SystemSettingMapper.java
│   ├── service/
│   │   ├── AuthService.java
│   │   ├── UserService.java
│   │   ├── OrderService.java
│   │   ├── ArticleService.java
│   │   ├── SettingsService.java
│   │   └── ChatService.java
│   └── dto/
│       ├── LoginRequest.java
│       ├── LoginResponse.java
│       ├── PageResult.java
│       ├── UserQuery.java
│       ├── OrderQuery.java
│       ├── ArticleQuery.java
│       ├── ArticleForm.java
│       ├── ChatRequest.java
│       └── ChatResponse.java
├── src/main/resources/
│   ├── application.yml                  # 数据库 / JWT 配置
│   └── schema.sql                       # H2 建表语句
└── src/test/java/com/admin/
    └── AdminApplicationTests.java
```

## 关键设计决策

1. **JWT 认证**：登录成功后签发 token，通过 Spring Security Filter 拦截校验。`/api/auth/login` 放行，其余需要 token
2. **初始账号**：启动时自动创建 admin/admin123
3. **H2 控制台**：开发期间可访问 http://localhost:8080/h2-console
4. **跨域**：配置 CORS 允许前端开发服务器（localhost:5173）访问
5. **分页**：MyBatis-Plus 的 Page 对象自动处理
6. **Chat**：简单关键词匹配 + 预设回复，与前端 mock 逻辑一致

## 实施顺序

1. pom.xml + application.yml + schema.sql（项目骨架）
2. Entity 类 + Mapper 接口
3. DTO 类
4. Service 层
5. Controller 层
6. JWT + Security 配置
7. DataInitializer（预设数据）
8. 启动测试

## 验证方式

1. `mvn spring-boot:run` 启动后端
2. `curl -X POST localhost:8080/api/auth/login -H 'Content-Type: application/json' -d '{"username":"admin","password":"admin123"}'` 获取 token
3. 前端修改 `.env` 设置 `VITE_API_BASE_URL=http://localhost:8080/api`（去掉 mock 逻辑或通过环境变量控制）
4. 依次测试各模块 CRUD
