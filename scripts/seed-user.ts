// 运行方式：npx tsx --env-file=.env.local scripts/seed-user.ts
//
// SHA-256("123456") = 8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92
// bcrypt(SHA-256("123456"), 12) → 存入数据库

import bcrypt from "bcryptjs";
import SHA256 from "crypto-js/sha256";
import { getDb } from "../lib/mongodb.js";

async function seed() {
  const db = await getDb();

  // 1. 创建 users 集合的索引（首次插入时自动创建集合）
  await db.collection("users").createIndex({ username: 1 }, { unique: true });

  // 2. 客户端先做 SHA-256，服务端再做 bcrypt
  const sha256Password = SHA256("123456").toString();
  const hashedPassword = await bcrypt.hash(sha256Password, 12);

  const result = await db.collection("users").updateOne(
    { username: "admin" },
    {
      $set: {
        username: "admin",
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );

  console.log(result.upsertedCount
    ? `✅ 测试用户已创建：username=admin, password=123456`
    : `✅ 测试用户已更新：username=admin, password=123456`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ 种子数据写入失败:", err);
  process.exit(1);
});
