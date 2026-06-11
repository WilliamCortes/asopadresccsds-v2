import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";

interface ProjectTeaserProps {
  locale: string;
}

export function ProjectTeaser({ locale }: ProjectTeaserProps) {
  const t = useTranslations("home_v2.proyecto");
  const localePath = (href: string) => `/${locale}${href}`;

  return (
    <section className="section proyecto" id="proyecto">
      <div className="container">
        <div className="proyecto-head reveal">
          <span className="eyebrow">{t("eyebrow")}</span>
          <h2>{t("title")}</h2>
          <p>{t("lead")}</p>
        </div>

        <div className="proyecto-progress reveal delay-1">
          <div className="progress-meta">
            <div>
              <div className="meta-label">{t("goal_label")}</div>
              <strong>$50.000.000 COP</strong>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="meta-label">{t("raised_label")}</div>
              <strong style={{ color: "var(--dorado-oscuro)" }}>$0</strong>
            </div>
          </div>
          <div className="progress-bar" role="progressbar" aria-label="Progreso de recaudo" aria-valuenow={0} aria-valuemin={0} aria-valuemax={100}>
            <div className="progress-fill" data-fill="2"></div>
          </div>
          <div className="progress-bottom">
            <span>{t("progress_text")}</span>
            <span className="progress-percent">{t("progress_percent")}</span>
          </div>
        </div>

        <div className="proyecto-compare">
          <div className="compare-item reveal delay-1">
            <span className="label">{t("compare_today")}</span>
            <Image src="/images/proyecto_cancha.jpg" alt="Cancha actual" fill className="img-cover" />
          </div>
          <div className="compare-item future reveal delay-2">
            <span className="label">{t("compare_future")}</span>
            <Image src="/images/proyecto_cancha_2.jpg" alt="Render del proyecto de cancha cubierta" fill className="img-cover" />
          </div>
        </div>

        <div className="proyecto-cta reveal">
          <Link className="btn btn-primary" href={localePath("/proyecto-cancha")}>
            {t("cta")}
            <svg className="arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
