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
    <div className={cn("nav-lang-wrap", className)}>
      <button
        onClick={() => setOpen(!open)}
        className="nav-lang-toggle"
        aria-label="Cambiar idioma / Change language"
        aria-expanded={open}
      >
        <Globe className="h-4 w-4" />
        <span className="uppercase">{locale}</span>
      </button>

      {open && (
        <>
          <div className="nav-lang-backdrop" onClick={() => setOpen(false)} />
          <div className="nav-lang-menu" role="menu">
            {LOCALES.map((l) => (
              <button
                key={l.code}
                role="menuitem"
                onClick={() => switchLocale(l.code)}
                className={cn("nav-lang-option", locale === l.code && "is-active")}
              >
                <span className="nav-lang-option-code">{l.label}</span>
                <span>{l.full}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
