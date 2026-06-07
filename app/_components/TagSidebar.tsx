"use client";

import { useMemo } from "react";
import type { Post } from "@/app/_lib/types";

interface TagSidebarProps {
  posts: Post[];
}

export default function TagSidebar({ posts }: TagSidebarProps) {
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [posts]);

  if (tagCounts.length === 0) return null;

  return (
    <aside className="hidden lg:block w-56 shrink-0">
      <div className="sticky top-16">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4 uppercase tracking-wider">
          标签分类
        </h3>
        <ul className="space-y-1">
          {tagCounts.map(([tag, count]) => (
            <li key={tag}>
              <a
                href={`/tags/${encodeURIComponent(tag)}`}
                className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
              >
                <span className="group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors">
                  {tag}
                </span>
                <span className="text-xs text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                  {count}
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* 快速链接 */}
        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4 uppercase tracking-wider">
            关于
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Hongyi&apos;s Blog — 分享 Web 开发、AI 技术和学习心得。
          </p>
        </div>
      </div>
    </aside>
  );
}
