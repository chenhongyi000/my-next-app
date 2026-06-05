import type { Post } from "@/app/_lib/types";

export const posts: Post[] = [
  {
    id: "1",
    title: "Building a Blog with Next.js 16 and Tailwind CSS v4",
    slug: "building-blog-nextjs-16",
    date: "2026-05-20",
    excerpt:
      "Learn how to leverage the latest features of Next.js 16 and Tailwind CSS v4 to build a fast, responsive personal blog from scratch.",
    tags: ["Next.js", "Tailwind CSS", "Tutorial"],
  },
  {
    id: "2",
    title: "Understanding React Server Components",
    slug: "understanding-react-server-components",
    date: "2026-05-15",
    excerpt:
      "React Server Components represent a fundamental shift in how we build React applications. This post explores the mental model behind RSCs.",
    tags: ["React", "Server Components", "Architecture"],
  },
  {
    id: "3",
    title: "TypeScript Patterns I Use Every Day",
    slug: "typescript-patterns-every-day",
    date: "2026-05-10",
    excerpt:
      "A collection of TypeScript patterns and utility types that make my daily development work more productive and type-safe.",
    tags: ["TypeScript", "Patterns", "DX"],
  },
  {
    id: "4",
    title: "The Case for Semantic HTML",
    slug: "case-for-semantic-html",
    date: "2026-05-05",
    excerpt:
      "Semantic HTML improves accessibility, SEO, and maintainability. Here's why you should care and how to do it right.",
    tags: ["HTML", "Accessibility", "Web Standards"],
  },
  {
    id: "5",
    title: "Designing Resilient CSS Systems",
    slug: "designing-resilient-css-systems",
    date: "2026-04-28",
    excerpt:
      "How to build CSS that scales across teams and time — lessons learned from maintaining large codebases with utility-first CSS.",
    tags: ["CSS", "Design Systems", "Tailwind"],
  },
  {
    id: "6",
    title: "Getting Started with Personal Knowledge Management",
    slug: "personal-knowledge-management",
    date: "2026-04-20",
    excerpt:
      "Tools and strategies for building a personal knowledge management system that actually sticks.",
    tags: ["Productivity", "PKM", "Learning"],
  },
];
