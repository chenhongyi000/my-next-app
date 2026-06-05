import type { Post } from "@/app/_lib/types";

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:shadow-lg hover:shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:shadow-zinc-950/50">
      <div className="mb-3 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
          >
            {tag}
          </span>
        ))}
      </div>
      <h2 className="mb-2 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
        <a href={`/posts/${post.slug}`}>{post.title}</a>
      </h2>
      <time
        dateTime={post.date}
        className="mb-3 text-sm text-zinc-500 dark:text-zinc-500"
      >
        {new Date(post.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
      <p className="line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {post.excerpt}
      </p>
    </article>
  );
}
