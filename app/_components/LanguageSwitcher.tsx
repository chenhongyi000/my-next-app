"use client";

import { Button } from "@mui/material";
import { Translate } from "@mui/icons-material";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

const localeLabels: Record<string, string> = {
  en: "中文",
  zh: "English",
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === "en" ? "zh" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <Button
      variant="outlined"
      startIcon={<Translate />}
      onClick={toggleLocale}
      size="small"
      sx={{ borderRadius: 1.5, textTransform: "none", minWidth: 90 }}
    >
      {localeLabels[locale]}
    </Button>
  );
}
