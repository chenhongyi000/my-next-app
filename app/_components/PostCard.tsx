"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Post } from "@/app/_lib/types";

export default function PostCard({ post }: { post: Post }) {
  const locale = useLocale();

  return (
    <article className="group flex items-start gap-5 py-6 border-b border-zinc-100 last:border-b-0 dark:border-zinc-800 transition-colors">
      {/* Date on the left */}
      <time
        dateTime={post.date}
        className="shrink-0 w-28 pt-0.5 text-xs text-zinc-400 dark:text-zinc-500 tabular-nums hidden sm:block"
      >
        {new Date(post.date).toLocaleDateString(locale, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>

      {/* Content on the right */}
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors mb-1.5">
          <Link href={`/posts/${post.id}`} className="hover:underline decoration-1 underline-offset-4">
            {post.title}
          </Link>
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-2">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="text-xs text-zinc-400 dark:text-zinc-500 ml-auto shrink-0">
            阅读更多 →
          </span>
        </div>
      </div>
    </article>
  );
}
