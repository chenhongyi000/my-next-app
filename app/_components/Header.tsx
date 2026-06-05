export default function Header() {
  return (
    <header className="w-full border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 px-6 py-8 sm:flex-row sm:items-end sm:justify-between sm:py-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            Hongyi's Blog
          </h1>
          <p className="mt-2 text-lg text-zinc-500 dark:text-zinc-400">
            Thoughts on web development, design, and learning.
          </p>
        </div>
        <nav>
          <ul className="flex gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {[
              ["/", "Home"],
              ["/about", "About"],
              ["/archive", "Archive"],
            ].map(([href, label]) => (
              <li key={href}>
                <a
                  href={href}
                  className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
