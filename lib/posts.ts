// 博文数据访问层
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export interface PostDocument {
  _id?: ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PostFormData = Pick<PostDocument, "title" | "slug" | "excerpt" | "content" | "tags">;

export async function getPostsByAuthor(authorId: string): Promise<PostDocument[]> {
  const db = await getDb();
  return db
    .collection<PostDocument>("posts")
    .find({ authorId })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getPostById(id: string): Promise<PostDocument | null> {
  const db = await getDb();
  return db.collection<PostDocument>("posts").findOne({ _id: new ObjectId(id) });
}

export async function createPost(authorId: string, data: PostFormData): Promise<PostDocument> {
  const db = await getDb();
  const now = new Date();
  const doc: PostDocument = {
    ...data,
    authorId,
    createdAt: now,
    updatedAt: now,
  };
  const result = await db.collection<PostDocument>("posts").insertOne(doc as any);
  return { ...doc, _id: result.insertedId };
}

export async function updatePost(id: string, data: PostFormData): Promise<boolean> {
  const db = await getDb();
  const result = await db
    .collection<PostDocument>("posts")
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } }
    );
  return result.matchedCount > 0;
}

export async function deletePost(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db.collection<PostDocument>("posts").deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
