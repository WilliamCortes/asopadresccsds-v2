"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const LOCALES = [
  { code: "es", label: "ES", full: "Español" },
  { code: "en", label: "EN", full: "English" },
  { code: "fr", label: "FR", full: "Français" },
] as const;

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const switchLocale = (newLocale: string) => {
    // Replace locale prefix in pathname
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
    setOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm font-medium transition-colors px-2 py-1 rounded-md hover:opacity-70"
        aria-label="Cambiar idioma / Change language"
      >
        <Globe className="h-4 w-4" />
        <span className="uppercase">{locale}</span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 z-50 min-w-[120px] rounded-lg border border-border bg-background shadow-lg py-1">
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => switchLocale(l.code)}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2",
                  locale === l.code && "text-brand-blue font-medium"
                )}
              >
                <span className="font-mono text-xs uppercase text-muted-foreground w-6">
                  {l.label}
                </span>
                <span>{l.full}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
