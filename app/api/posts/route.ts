import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getPostsByAuthor, createPost } from "@/lib/posts";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, message: "请先登录" }, { status: 401 });
  }

  const posts = await getPostsByAuthor(user.userId);
  return NextResponse.json({ success: true, posts });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, message: "请先登录" }, { status: 401 });
  }

  const body = await request.json();
  const { title, slug, excerpt, content, tags } = body;

  if (!title || !slug || !content) {
    return NextResponse.json(
      { success: false, message: "标题、slug 和内容为必填项" },
      { status: 400 }
    );
  }

  const post = await createPost(user.userId, {
    title,
    slug,
    excerpt: excerpt || "",
    content,
    tags: tags || [],
  });

  return NextResponse.json({ success: true, post }, { status: 201 });
}
