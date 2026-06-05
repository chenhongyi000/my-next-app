export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <p className="text-sm text-zinc-500 dark:text-zinc-500">
          &copy; {new Date().getFullYear()} Hongyi's Blog. Built with Next.js.
        </p>
      </div>
    </footer>
  );
}
