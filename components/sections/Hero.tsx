import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

interface HeroProps {
  locale: string;
}

export function Hero({ locale }: HeroProps) {
  const t = useTranslations("home_v2.hero");
  const localePath = (href: string) => `/${locale}${href}`;

  return (
    <section className="hero">
      <div className="hero-bg">
        <Image
          src="/images/retro_frente_colegio.jpg"
          alt="Fachada del Colegio Campestre Santo Domingo Savio"
          fill
          priority
          quality={90}
          className="img-cover"
        />
      </div>

      <div className="hero-inner">
        <div className="container">
          <div className="reveal is-in">
            <span className="hero-badge">
              <span className="dot" aria-hidden="true"></span>
              {t("badge")}
            </span>
          </div>
          <h1 className="reveal delay-1 is-in">
            {t.rich("title", { em: (chunks) => <em>{chunks}</em> })}
          </h1>
          <p className="lead reveal delay-2 is-in">{t("lead")}</p>
          <div className="hero-ctas reveal delay-3 is-in">
            <Link className="btn btn-primary" href={localePath("/proyecto-cancha")}>
              {t("cta_project")}
              <svg className="arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
            </Link>
            <Link className="btn btn-ghost" href="#identidad">
              {t("cta_about")}
            </Link>
          </div>
        </div>
      </div>

      <div className="hero-scroll" aria-hidden="true">{t("scroll")}</div>

      <div className="hero-meta">
        <strong>{t("meta_name")}</strong>
        <span>{t("meta_nit")}</span>
        <span>{t("meta_ccf")}</span>
        <span>{t("meta_type")}</span>
      </div>
    </section>
  );
}
