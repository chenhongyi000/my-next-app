import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type { PostDocument } from "@/lib/posts";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "文章不存在" },
      { status: 404 }
    );
  }

  const db = await getDb();
  const post = await db.collection<PostDocument>("posts").findOne(
    { _id: new ObjectId(id) },
    {
      projection: {
        _id: 1,
        title: 1,
        slug: 1,
        excerpt: 1,
        content: 1,
        tags: 1,
        createdAt: 1,
      },
    }
  );

  if (!post) {
    return NextResponse.json(
      { success: false, message: "文章不存在" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    post: {
      id: post._id!.toString(),
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      tags: post.tags,
      createdAt: post.createdAt.toISOString(),
    },
  });
}
