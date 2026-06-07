import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type { PostDocument } from "@/lib/posts";
import Header from "@/app/_components/Header";
import Footer from "@/app/_components/Footer";

export const dynamic = "force-dynamic";

async function getPost(id: string) {
  console.log('id', id)
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  return db.collection<PostDocument>("posts").findOne({ _id: new ObjectId(id) });
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) notFound();

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1 mx-auto max-w-3xl w-full px-6 py-12">
        <article>
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="rounded-full bg-zinc-100 px-3 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4">
            {post.title}
          </h1>

          {/* Date */}
          <time className="text-sm text-zinc-500 dark:text-zinc-500 mb-8 block">
            {new Date(post.createdAt).toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>

          {/* Content */}
          <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
