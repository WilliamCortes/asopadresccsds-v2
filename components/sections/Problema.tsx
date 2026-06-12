import { useTranslations } from "next-intl";
import Image from "next/image";

export function Problema() {
  const t = useTranslations("home_v2.problema");

  return (
    <section className="section problema">
      <div className="container">
        <div className="problema-grid">
          <div>
            <span className="eyebrow reveal">{t("eyebrow")}</span>
            <h2 className="reveal delay-1">
              {t.rich("title", { em: (chunks) => <em>{chunks}</em> })}
            </h2>
            <p className="lead reveal delay-2">{t("lead")}</p>

            <ul className="problema-list">
              <li className="reveal delay-2">
                <span className="num">{t("stat1_num")}</span>
                <span>{t("stat1_text")}</span>
              </li>
              <li className="reveal delay-3">
                <span className="num">{t("stat2_num")}</span>
                <span>{t("stat2_text")}</span>
              </li>
              <li className="reveal delay-4">
                <span className="num">{t("stat3_num")}</span>
                <span>{t("stat3_text")}</span>
              </li>
            </ul>
          </div>

          <div className="problema-img reveal delay-2">
            <Image
              src="/images/cancha_actual_colegio.png"
              alt="Cancha actual a la intemperie del Colegio Campestre Santo Domingo Savio"
              fill
              className="img-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
