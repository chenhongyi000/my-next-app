"use client";

import Link from "next/link";
import LoginButton from "./LoginButton";
import LanguageSwitcher from "./LanguageSwitcher";
import DashboardButton from "./DashboardButton";

export default function Header() {
  return (
    <header className="w-full border-b border-border">
      <div className="mx-auto flex max-w-6xl items-end justify-between px-6 py-8 sm:py-10">
        <div>
          <Link href="/">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Hongyi's Blog
            </h1>
          </Link>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Thoughts on web development, design, and learning.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DashboardButton />
          <LoginButton />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
