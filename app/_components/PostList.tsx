import { posts } from "@/app/_lib/posts";
import PostCard from "@/app/_components/PostCard";

export default function PostList() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <h2 className="mb-8 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        Latest Posts
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
