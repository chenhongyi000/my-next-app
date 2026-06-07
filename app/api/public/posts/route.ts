import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import type { PostDocument } from "@/lib/posts";

export async function GET() {
  const db = await getDb();
  const posts = await db
    .collection<PostDocument>("posts")
    .find(
      {},
      {
        projection: {
          _id: 1,
          title: 1,
          slug: 1,
          excerpt: 1,
          tags: 1,
          createdAt: 1,
        },
      }
    )
    .sort({ createdAt: -1 })
    .limit(10)
    .toArray();

  return NextResponse.json({
    success: true,
    posts: posts.map((p) => ({
      id: p._id!.toString(),
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      tags: p.tags,
      date: p.createdAt.toISOString(),
    })),
  });
}
