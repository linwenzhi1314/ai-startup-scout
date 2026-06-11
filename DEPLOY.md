# AI Startup Scout 部署指南

## 目录

- [当前架构（Vercel）](#当前架构vercel)
- [目标架构（云服务器 + 域名）](#目标架构云服务器--域名)
- [迁移检查清单](#迁移检查清单)
- [火山引擎部署步骤](#火山引擎部署步骤)
- [域名配置](#域名配置)
- [回滚方案](#回滚方案)

---

## 当前架构（Vercel）

```
用户 → Vercel CDN → Next.js 应用
              ↓
         Vercel 存储桶（ZIP 下载）
```

- **部署地址**：`https://ai-startup-scout.vercel.app`
- **扩展下载**：`/ai-startup-scout.zip`
- **扩展 API**：`/api/search`、`/api/analyze`、`/api/feedback`

---

## 目标架构（云服务器 + 域名）

```
用户 → 域名 → CDN/DNS → 云服务器 (Nginx)
                              ↓
                      Docker 容器 (Next.js + API)
                              ↓
                      云数据库 (Supabase)
```

- **主域名**：`https://www.aistartupscout.com`
- **扩展下载**：`https://www.aistartupscout.com/ai-startup-scout.zip`
- **API 域名**：`https://api.aistartupscout.com` 或共用主域名

---

## 迁移检查清单

### 迁移前必做

- [ ] 在火山引擎购买域名（已有 `aistartupscout.com` 相关域名）
- [ ] 开通云服务器 ECS（推荐 2核4G 起）
- [ ] 开放服务器端口：22（SSH）、80（HTTP）、443（HTTPS）
- [ ] 安装 Docker 和 Docker Compose
- [ ] 安装 Nginx 并配置反向代理
- [ ] 申请 SSL 证书（Let's Encrypt 免费）
- [ ] 配置 DNS 解析
- [ ] 测试 API 端点连通性
- [ ] 切换 Chrome 扩展 API 地址（从 Vercel 改为新域名）
- [ ] 重新打包扩展 ZIP，上传 Chrome Web Store 更新

### 迁移当天

- [ ] 确认新服务器所有功能正常
- [ ] 修改 DNS 解析（TTL 建议提前设为 300）
- [ ] 监控错误日志
- [ ] 准备回滚（见下方回滚方案）

---

## 火山引擎部署步骤

### 1. 环境准备

```bash
# 连接服务器
ssh root@<服务器IP>

# 安装 Docker
curl -fsSL https://get.docker.com | sh

# 安装 Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 安装 Nginx
apt update && apt install -y nginx

# 申请 SSL 证书（使用 Certbot）
apt install -y certbot python3-certbot-nginx
certbot --nginx -d www.aistartupscout.com -d aistartupscout.com
```

### 2. Nginx 反向代理配置

```nginx
# /etc/nginx/sites-available/aistartupscout
server {
    listen 80;
    server_name www.aistartupscout.com aistartupscout.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.aistartupscout.com aistartupscout.com;

    ssl_certificate /etc/letsencrypt/live/aistartupscout.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aistartupscout.com/privkey.pem;

    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# 启用配置
ln -s /etc/nginx/sites-available/aistartupscout /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 3. 部署应用（Docker 方式）

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  web:
    build: .
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - TAVILY_API_KEY=${TAVILY_API_KEY}
      - DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - NEXT_PUBLIC_API_BASE_URL=https://www.aistartupscout.com
    volumes:
      - ./ai-startup-scout.zip:/app/public/ai-startup-scout.zip:ro
```

```bash
# 部署命令
export TAVILY_API_KEY=tvly-xxx
export DEEPSEEK_API_KEY=sk-xxx
export NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
export NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
export SUPABASE_SERVICE_ROLE_KEY=eyJxxx
export NEXT_PUBLIC_API_BASE_URL=https://www.aistartupscout.com

docker-compose up -d --build
```

### 4. 自动更新脚本（可选）

```bash
#!/bin/bash
# deploy.sh
cd /opt/ai-startup-scout

git pull origin main

docker-compose down
docker-compose up -d --build

# 重启后检查
sleep 10
curl -f http://localhost:3000 || (docker-compose logs && exit 1)
```

```bash
# 设置定时更新（每天凌晨2点）
0 2 * * * /opt/ai-startup-scout/deploy.sh >> /var/log/deploy.log 2>&1
```

---

## 域名配置

### DNS 解析设置（火山引擎控制台）

| 记录类型 | 主机记录 | 记录值 | TTL |
|----------|---------|--------|-----|
| A | @ | `<服务器公网IP>` | 300 |
| A | www | `<服务器公网IP>` | 300 |
| CNAME | api | `<服务器公网IP>` 或 CDN | 300 |

### 扩展 API 地址切换

迁移完成后需要更新扩展代码中的 API 地址：

**文件：`public/extension/popup.js` 和 `public/extension/background.js`**

```javascript
// 旧地址（Vercel）
const API_BASE = 'https://ai-startup-scout.vercel.app';

// 新地址（云服务器）
const API_BASE = 'https://www.aistartupscout.com';
```

**文件：`src/app/api/config/route.ts`**

```typescript
// 修改 fallback 地址
const fallbackBase = 'https://www.aistartupscout.com';
```

更新后重新打包 ZIP，上传到 Chrome Web Store。

---

## 回滚方案

### 方案A：DNS 回滚（推荐）

1. 登录火山引擎 DNS 控制台
2. 将 A 记录改回 Vercel 的 CNAME 或 IP
3. 等待 DNS 传播（TTL 内生效）
4. 扩展用户会自动切换回 Vercel

### 方案B：保持双线运行

- 新服务器部署完整功能
- DNS 逐步切换流量（先 10% → 50% → 100%）
- 发现问题立即切回 Vercel

---

## 环境变量清单

| 变量名 | 说明 | 来源 |
|--------|------|------|
| `TAVILY_API_KEY` | Tavily 搜索 API Key | 火山引擎 / 沙箱环境变量 |
| `DEEPSEEK_API_KEY` | DeepSeek LLM API Key | 火山引擎 / 沙箱环境变量 |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目地址 | Supabase 控制台 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名 Key | Supabase 控制台 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 服务端 Key | Supabase 控制台 |
| `NEXT_PUBLIC_API_BASE_URL` | 网站访问域名 | 自定义域名 |
