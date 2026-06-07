# Hongyi Blog

个人博客网站，用于分享 Web 开发、AI 技术等心得。

## 技术栈

- **框架**: Next.js 16 (App Router) + TypeScript
- **数据库**: MongoDB 8.0 (via `mongodb` driver)
- **UI**: MUI (Material-UI) v9 + Tailwind CSS v4
- **认证**: JWT (jose) + bcryptjs
- **i18n**: next-intl (中/英双语)

## 目录结构

```
├── app/                          # Next.js App Router
│   ├── layout.tsx                # 根布局（html/body 框架）
│   ├── page.tsx                  # 根页面（重定向用）
│   ├── globals.css               # 全局样式 & CSS 变量
│   ├── [locale]/                 # 多语言路由组
│   │   ├── layout.tsx            # 语言布局（NextIntlClientProvider）
│   │   ├── page.tsx              # 首页
│   │   ├── login/page.tsx        # 登录/注册页
│   │   ├── posts/[id]/page.tsx   # 文章详情页（SSR → MongoDB）
│   │   └── dashboard/            # 创作中心
│   │       ├── page.tsx          # 文章管理列表
│   │       └── posts/            # 新建/编辑文章
│   ├── _components/              # 共享 UI 组件（页面级组件）
│   │   ├── Header.tsx            # 顶部导航
│   │   ├── Footer.tsx            # 页脚
│   │   ├── PostList.tsx          # 文章列表（客户端 fetch）
│   │   ├── PostCard.tsx          # 文章卡片
│   │   ├── PostEditor.tsx        # 文章编辑器表单
│   │   ├── LoginButton.tsx       # 登录/用户状态按钮
│   │   ├── DashboardButton.tsx   # 创作中心入口
│   │   ├── LanguageSwitcher.tsx  # 语言切换
│   │   ├── TagSidebar.tsx        # 标签分类侧栏
│   │   └── *Chart.tsx            # D3 图表组件
│   ├── _lib/                     # 页面级数据/类型（mock 数据等）
│   │   ├── types.ts              # Post 类型定义
│   │   ├── posts.ts              # 静态 mock 数据（已废弃）
│   │   ├── chartData.ts          # 图表 mock 数据
│   │   └── chartTypes.ts         # 图表类型定义
│   └── api/                      # API Routes
│       ├── login/route.ts        # POST 登录
│       ├── register/route.ts     # POST 注册
│       ├── auth/
│       │   ├── me/route.ts       # GET 当前用户
│       │   └── logout/route.ts   # POST 登出
│       ├── posts/                # 创作中心 CRUD（需登录）
│       │   ├── route.ts          # GET 列表 / POST 创建
│       │   └── [id]/route.ts     # GET/PUT/DELETE 单篇
│       └── public/
│           └── posts/            # 公开接口（无需登录）
│               ├── route.ts      # GET 最新 10 篇
│               └── [id]/route.ts # GET 单篇文章详情
├── lib/                          # 服务端共享库
│   ├── mongodb.ts                # MongoDB 连接（全局缓存）
│   ├── auth.ts                   # JWT 签发/验证/Cookie 操作
│   └── posts.ts                  # 文章数据访问层（DAO）
├── i18n/                         # 国际化配置
│   ├── config.ts                 # 语言列表 & 默认语言
│   ├── request.ts                # next-intl 请求配置
│   └── navigation.ts             # 语言感知的 Link/useRouter
├── messages/                     # 翻译文件
│   ├── en.json
│   └── zh.json
├── scripts/
│   └── seed-user.ts              # 种子数据脚本
├── middleware.ts                  # next-intl 中间件
├── next.config.ts                 # Next.js 配置
├── tsconfig.json
├── postcss.config.mjs
└── package.json
```

## 编码规范

### 组件规范
- 页面组件放 `app/[locale]/`，按路由组织
- 共享 UI 组件放 `app/_components/`，文件名用 PascalCase
- 组件优先使用 **服务端组件（Server Component）**，需要交互时才加 `"use client"`
- 从数据库取数据的页面用 `export const dynamic = "force-dynamic"` 避免 SSG 缓存

### API 规范
- API 路由放 `app/api/`，按 RESTful 风格命名
- 需认证的接口调用 `getCurrentUser()` 检查 JWT Cookie
- 返回格式统一 `{ success: boolean, message?: string, ...data }`
- POST/PUT body 用 `request.json()` 解析

### 数据库
- 通过 `lib/mongodb.ts` 的 `getDb()` 获取数据库实例
- 数据访问逻辑集中在 `lib/` 下的 DAO 模块中
- 用户密码：客户端 SHA-256 → 服务端 bcrypt（12 rounds）→ 存入 MongoDB
- JWT Token 使用 `jose` 库，存储在 httpOnly Cookie `auth-token` 中

### i18n
- 翻译 key 在 `messages/{locale}.json` 中定义
- 组件中通过 `useTranslations()` / `useLocale()` 使用
- 导航链接使用 `@/i18n/navigation` 的 `Link`/`useRouter`（语言感知）
- 新功能仅限中文即可，基础框架已支持双语

### 密码传输
- 登录/注册时，客户端先用 `crypto-js/sha256` 对明文密码做哈希
- 服务端接收到 SHA-256 哈希值后，再用 `bcrypt.compare/bcrypt.hash` 处理
- 密码绝不明文传输或明文存储

## 环境变量

```bash
MONGODB_URI=mongodb://user:pass@host:27017/db
MONGODB_DB=blog
JWT_SECRET=your-random-secret
```

密码中含 `@` 时需 URL 编码为 `%40`。
