import { MongoClient, type MongoClientOptions } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_URI) {
  throw new Error(
    "请在 .env.local 文件中定义 MONGODB_URI 环境变量"
  );
}

if (!MONGODB_DB) {
  throw new Error(
    "请在 .env.local 文件中定义 MONGODB_DB 环境变量"
  );
}

const options: MongoClientOptions = {};

/**
 * 全局缓存的 MongoClient 实例（Next.js 开发模式下热重载复用连接）
 */
interface MongoClientCache {
  conn: MongoClient;
  promise: Promise<MongoClient>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalWithMongo = globalThis as typeof globalThis & {
  _mongoClientCache?: MongoClientCache;
};

async function connectMongoClient(): Promise<MongoClient> {
  if (globalWithMongo._mongoClientCache?.conn) {
    return globalWithMongo._mongoClientCache.conn;
  }

  if (!globalWithMongo._mongoClientCache?.promise) {
    const client = new MongoClient(MONGODB_URI!, options);
    const promise = client.connect();
    globalWithMongo._mongoClientCache = { conn: client as unknown as MongoClient, promise };
  }

  try {
    const client = await globalWithMongo._mongoClientCache!.promise;
    globalWithMongo._mongoClientCache!.conn = client;
    return client;
  } catch (error) {
    globalWithMongo._mongoClientCache = undefined;
    throw error;
  }
}

/**
 * 获取 MongoDB 数据库实例
 *
 * 用法：
 * ```ts
 * import { getDb } from "@/lib/mongodb";
 * const db = await getDb();
 * const posts = await db.collection("posts").find({}).toArray();
 * ```
 */
export async function getDb() {
  const client = await connectMongoClient();
  return client.db(MONGODB_DB);
}

/**
 * 获取 MongoClient 实例（用于事务、session 等高级用法）
 */
export async function getClient() {
  return connectMongoClient();
}
