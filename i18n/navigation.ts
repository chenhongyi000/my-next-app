import { createNavigation } from "next-intl/navigation";
import { locales, defaultLocale } from "./config";

export const { Link, useRouter, usePathname, redirect, getPathname } =
  createNavigation({
    locales,
    defaultLocale,
    localePrefix: "as-needed",
  });
