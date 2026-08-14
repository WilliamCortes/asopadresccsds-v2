/**
 * SECCIÓN TEMPORAL — Festival de Cometas 2026.
 * Quitar este archivo, su registro en app/[locale]/page.tsx, el bloque
 * ".festival"/".nav-link-festival" en app/styles/v2-design-system.css,
 * las claves "home_v2.festival" y "nav.festival" en messages/*.json, y
 * el <li> temporal en components/layout/Header.tsx — todo después del
 * 29 de agosto de 2026.
 */
import { useTranslations } from "next-intl";
import Image from "next/image";

export function Festival() {
  const t = useTranslations("home_v2.festival");

  return (
    <section className="section festival" id="festival-cometas">
      <div className="container">
        <div className="festival-grid">
          <div className="festival-img reveal">
            <Image
              src="/images/volando_cometa.jpg"
              alt="Niños volando cometas en el Festival de Cometas"
              fill
              className="img-cover"
              sizes="(max-width: 900px) 100vw, 45vw"
            />
          </div>

          <div className="festival-content">
            <span className="eyebrow reveal">{t("eyebrow")}</span>
            <h2 className="reveal delay-1">
              {t("title_line1")}
              <br />
              <em>{t("title_line2")}</em>
            </h2>
            <p className="lead reveal delay-2">{t("lead")}</p>

            <ul className="festival-meta reveal delay-2">
              <li>
                <strong>{t("date_label")}</strong>
                <span>{t("date_value")}</span>
              </li>
              <li>
                <strong>{t("time_label")}</strong>
                <span>{t("time_value")}</span>
              </li>
              <li>
                <strong>{t("place_label")}</strong>
                <span>{t("place_value")}</span>
              </li>
            </ul>

            <div className="festival-ctas reveal delay-3">
              <a
                className="btn btn-primary"
                href="https://wa.me/573204413330?text=Hola%2C%20quiero%20confirmar%20mi%20asistencia%20al%20Festival%20de%20Cometas%202026"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("cta_confirm")}
                <svg className="arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
              </a>
              <a className="btn btn-secondary" href="#festival-donar">
                {t("cta_donate")}
              </a>
            </div>
          </div>
        </div>

        <div className="festival-donar reveal" id="festival-donar">
          <span className="eyebrow">{t("donar_eyebrow")}</span>
          <h3>{t("donar_title")}</h3>
          <p>{t.rich("donar_lead", { strong: (chunks) => <strong>{chunks}</strong> })}</p>

          <div className="festival-donar-contacts">
            <div className="contact-card">
              <span className="role">{t("role_president")}</span>
              <strong>Rosa Izquierdo</strong>
              <a href="https://wa.me/573204413330" target="_blank" rel="noopener noreferrer">320 441 3330</a>
            </div>
            <div className="contact-card">
              <span className="role">{t("role_treasurer")}</span>
              <strong>Katherin Reina</strong>
              <a href="https://wa.me/573054116823" target="_blank" rel="noopener noreferrer">305 411 6823</a>
            </div>
          </div>
        </div>

        <p className="festival-note">{t("note")}</p>
      </div>
    </section>
  );
}
