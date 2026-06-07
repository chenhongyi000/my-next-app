import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getPostById, updatePost, deletePost } from "@/lib/posts";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, message: "请先登录" }, { status: 401 });
  }

  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    return NextResponse.json({ success: false, message: "文章不存在" }, { status: 404 });
  }

  if (post.authorId !== user.userId) {
    return NextResponse.json({ success: false, message: "无权访问" }, { status: 403 });
  }

  return NextResponse.json({ success: true, post });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, message: "请先登录" }, { status: 401 });
  }

  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    return NextResponse.json({ success: false, message: "文章不存在" }, { status: 404 });
  }

  if (post.authorId !== user.userId) {
    return NextResponse.json({ success: false, message: "无权访问" }, { status: 403 });
  }

  const body = await request.json();
  const { title, slug, excerpt, content, tags } = body;

  if (!title || !slug || !content) {
    return NextResponse.json(
      { success: false, message: "标题、slug 和内容为必填项" },
      { status: 400 }
    );
  }

  await updatePost(id, { title, slug, excerpt: excerpt || "", content, tags: tags || [] });
  return NextResponse.json({ success: true, message: "更新成功" });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, message: "请先登录" }, { status: 401 });
  }

  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    return NextResponse.json({ success: false, message: "文章不存在" }, { status: 404 });
  }

  if (post.authorId !== user.userId) {
    return NextResponse.json({ success: false, message: "无权访问" }, { status: 403 });
  }

  await deletePost(id);
  return NextResponse.json({ success: true, message: "删除成功" });
}
