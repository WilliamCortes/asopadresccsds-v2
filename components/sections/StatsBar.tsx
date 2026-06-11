import { useTranslations } from "next-intl";

export function StatsBar() {
  const t = useTranslations("home_v2.impacto");

  return (
    <section className="section impacto">
      <div className="container impacto-inner">
        <div className="impacto-head reveal">
          <span className="eyebrow">{t("eyebrow")}</span>
          <h2>{t("title")}</h2>
        </div>

        <div className="impacto-grid">
          <div className="metric reveal">
            <div className="metric-num" data-count="50" data-suffix="+">0<span className="suffix">+</span></div>
            <div className="metric-label">{t("metric1_label")}</div>
          </div>
          <div className="metric reveal delay-1">
            <div className="metric-num" data-count="3">0</div>
            <div className="metric-label">{t("metric2_label")}</div>
          </div>
          <div className="metric reveal delay-2">
            <div className="metric-num" data-count="2023">0</div>
            <div className="metric-label">{t("metric3_label")}</div>
          </div>
          <div className="metric reveal delay-3">
            <div className="metric-num" data-count="2040">0</div>
            <div className="metric-label">{t("metric4_label")}</div>
          </div>
        </div>

        <p className="impacto-note reveal">{t("note")}</p>
      </div>
    </section>
  );
}
