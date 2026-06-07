"use client";

import { useEffect, useState } from "react";
import PostCard from "@/app/_components/PostCard";
import TagSidebar from "@/app/_components/TagSidebar";
import type { Post } from "@/app/_lib/types";

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/posts")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setPosts(data.posts);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <div className="flex gap-10">
        {/* 主内容区 — 文章列表 */}
        <div className="flex-1 min-w-0">
          <h2 className="mb-8 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            最新文章
          </h2>

          {loading ? (
            <div className="space-y-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-28 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800"
                />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <p className="text-zinc-500">暂无文章</p>
          ) : (
            <div>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* 侧边栏 — 标签分类 */}
        <TagSidebar posts={posts} />
      </div>
    </section>
  );
}
