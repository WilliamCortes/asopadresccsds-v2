"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";

const NAV_LINKS = [
  { key: "about", href: "/quienes-somos" },
  { key: "legal", href: "/marco-legal" },
  { key: "project", href: "/proyecto-cancha" },
  { key: "news", href: "/comunicados" },
  { key: "contact", href: "/contactenos" },
] as const;

interface HeaderProps {
  locale: string;
}

export function Header({ locale }: HeaderProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  const [stuck, setStuck] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setStuck(true);
      return;
    }
    const onScroll = () => setStuck(window.scrollY > window.innerHeight - 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const localePath = (href: string) => `/${locale}${href}`;
  const donarHref = isHome ? "#donar" : `${localePath("/proyecto-cancha")}#donar`;

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <header className={`nav ${stuck ? "is-stuck" : "is-floating"}`} id="nav">
        <div className="nav-inner">
          <Link className="nav-brand" href={`/${locale}`} aria-label="ASOPADRES CCSDS">
            <span className="nav-brand-mark" aria-hidden="true">
              <Image src="/images/logo_asopadres.png" alt="" width={38} height={38} />
            </span>
            <span className="nav-brand-text">
              ASOPADRES CCSDS
              <small>{t("brand_sub")}</small>
            </span>
          </Link>

          <nav aria-label={t("aria_main")}>
            <ul className="nav-links">
              {NAV_LINKS.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    className="nav-link"
                    href={localePath(href)}
                    aria-current={pathname.startsWith(localePath(href)) ? "page" : undefined}
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav-cta">
            <LanguageSwitcher className="nav-lang" />
            <Link className="btn btn-secondary" href={donarHref}>
              {t("donate")}
            </Link>
            <Link className="btn btn-primary" href={localePath("/afiliate")}>
              {t("cta")}
            </Link>
            <button
              className="nav-burger"
              onClick={() => setDrawerOpen(true)}
              aria-label={t("menu")}
              aria-controls="drawer"
              aria-expanded={drawerOpen}
            >
              <svg width="20" height="14" viewBox="0 0 20 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M1 1h18M1 7h18M1 13h18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className={`nav-backdrop ${drawerOpen ? "is-open" : ""}`} onClick={closeDrawer} />
      <aside className={`nav-drawer ${drawerOpen ? "is-open" : ""}`} id="drawer" aria-hidden={!drawerOpen}>
        <button className="nav-drawer-close" onClick={closeDrawer} aria-label={t("close")}>
          ×
        </button>
        <ul className="nav-drawer-links">
          {NAV_LINKS.map(({ key, href }) => (
            <li key={key}>
              <Link href={localePath(href)} onClick={closeDrawer}>
                {t(key)}
              </Link>
            </li>
          ))}
        </ul>
        <div className="nav-drawer-cta">
          <Link className="btn btn-primary" href={localePath("/afiliate")} onClick={closeDrawer}>
            {t("cta")}
          </Link>
          <Link className="btn btn-secondary" href={donarHref} onClick={closeDrawer}>
            {t("donate")}
          </Link>
          <LanguageSwitcher className="nav-lang" />
        </div>
      </aside>
    </>
  );
}
