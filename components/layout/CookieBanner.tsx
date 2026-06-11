"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const COOKIE_KEY = "asopadres_cookie_consent";

interface CookieBannerProps {
  locale: string;
  isEU?: boolean;
}

export function CookieBanner({ locale, isEU = false }: CookieBannerProps) {
  const t = useTranslations("cookie_banner");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(COOKIE_KEY, "essential");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-[100] p-4",
        "animate-in slide-in-from-bottom-4 duration-500"
      )}
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="max-w-4xl mx-auto bg-white border border-border rounded-xl shadow-xl p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-sm text-foreground">
                ASOPADRES CCSDS — Cookies
              </p>
              {isEU && (
                <span className="inline-flex items-center text-xs bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded-full font-medium">
                  GDPR
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {t("text")}{" "}
              {isEU && (
                <span className="text-brand-blue font-medium">
                  {t("gdpr_notice")}{" "}
                </span>
              )}
              <Link
                href={`/${locale}/proteccion-datos`}
                className="text-brand-blue hover:underline"
              >
                {t("learn_more")}
              </Link>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={decline}
              className="text-xs border-border"
            >
              {t("decline")}
            </Button>
            <Button
              size="sm"
              onClick={accept}
              className="text-xs bg-brand-blue hover:bg-brand-blue-dark text-white"
            >
              {t("accept")}
            </Button>
            <button
              onClick={decline}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
