# Ubuntu 安装 MongoDB 指南

## 环境要求

- Ubuntu 20.04 / 22.04 / 24.04 (64-bit)
- 推荐至少 4GB 内存，10GB 磁盘空间

---

## 步骤 1：导入 MongoDB 公钥

```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
  sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-8.0.gpg
```

## 步骤 2：添加 MongoDB 源

根据 Ubuntu 版本选择对应命令：

### Ubuntu 24.04 (Noble)
```bash
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
```

### Ubuntu 22.04 (Jammy)
```bash
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/8.0 multiverse" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
```

### Ubuntu 20.04 (Focal)
```bash
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/8.0 multiverse" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
```

## 步骤 3：更新包索引并安装

```bash
sudo apt-get update
sudo apt-get install -y mongodb-org
```

## 步骤 4：启动 MongoDB

```bash
sudo systemctl start mongod
sudo systemctl enable mongod    # 开机自启
```

## 步骤 5：验证安装

```bash
# 查看服务状态
sudo systemctl status mongod

# 查看版本
mongod --version

# 连接测试
mongosh
```

---

## 安全配置（重要）

### 创建管理员用户

```bash
# 进入 MongoDB Shell
mongosh
```

```js
use admin

db.createUser({
  user: "admin",
  pwd: "YOUR_SECURE_PASSWORD",  // 替换为强密码
  roles: [{ role: "root", db: "admin" }]
})
```

### 开启认证

```bash
sudo nano /etc/mongod.conf
```

修改配置：
```yaml
security:
  authorization: enabled

# 同时绑定内网 IP（避免暴露公网）
net:
  bindIp: 127.0.0.1
```

重启生效：
```bash
sudo systemctl restart mongod
```

### 防火墙（可选）

```bash
# 如果只本机访问，不需要开放端口
# 如需内网访问：
sudo ufw allow from 10.0.0.0/8 to any port 27017
sudo ufw enable
```

---

## 常用管理命令

| 命令 | 说明 |
|------|------|
| `sudo systemctl status mongod` | 查看状态 |
| `sudo systemctl restart mongod` | 重启服务 |
| `sudo systemctl stop mongod` | 停止服务 |
| `mongosh` | 连接数据库 |
| `mongosh -u admin -p --authenticationDatabase admin` | 管理员登录 |

## 日志与数据路径

| 路径 | 说明 |
|------|------|
| `/var/log/mongodb/mongod.log` | 日志文件 |
| `/var/lib/mongodb` | 数据目录 |
| `/etc/mongod.conf` | 配置文件 |

---

## 卸载 MongoDB（如需）

```bash
sudo systemctl stop mongod
sudo apt-get purge -y mongodb-org*
sudo rm -r /var/log/mongodb /var/lib/mongodb
```
