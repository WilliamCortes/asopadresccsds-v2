import { useTranslations } from "next-intl";

const ICONS = {
  independent: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18M5 8h14M3 15c0-3 2-7 2-7s2 4 2 7-2 3-2 3-2 0-2-3zM17 15c0-3 2-7 2-7s2 4 2 7-2 3-2 3-2 0-2-3z" />
    </svg>
  ),
  community: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" />
      <path d="M3 19c0-3 2.5-5 6-5s6 2 6 5M14 19c0-2 1.5-3.5 4-3.5s4 1.5 4 3.5" />
    </svg>
  ),
  ally: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 12l2 2 6-6M3 12l4 4 9-9M12 19l3-3M5 19l3-3" />
      <path d="M2 16l5 5 5-5M22 16l-5 5-5-5" />
    </svg>
  ),
};

export function AboutPreview() {
  const t = useTranslations("home_v2.identidad");

  return (
    <section className="section identidad" id="identidad">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">{t("eyebrow")}</span>
          <h2>{t("title")}</h2>
          <p>{t("lead")}</p>
        </div>

        <div className="identidad-grid">
          <article className="card reveal delay-1">
            <div className="card-icon" aria-hidden="true">{ICONS.independent}</div>
            <h3>{t("card1_title")}</h3>
            <p>{t("card1_body")}</p>
          </article>

          <article className="card reveal delay-2">
            <div className="card-icon" aria-hidden="true">{ICONS.community}</div>
            <h3>{t("card2_title")}</h3>
            <p>{t("card2_body")}</p>
          </article>

          <article className="card reveal delay-3">
            <div className="card-icon" aria-hidden="true">{ICONS.ally}</div>
            <h3>{t("card3_title")}</h3>
            <p>{t("card3_body")}</p>
          </article>
        </div>

        <div className="identidad-quote reveal">
          <p className="pull-quote">{t("quote")}</p>
          <small>{t("quote_source")}</small>
        </div>
      </div>
    </section>
  );
}
