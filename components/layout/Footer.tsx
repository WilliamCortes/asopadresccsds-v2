import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

interface FooterProps {
  locale: string;
}

const DOCS = {
  estatutos: "/documents/ESTATUTOS ASOPADRES VIGENTE 2024.pdf",
  rut: "/documents/RUT ASOPADRES SEPTIEMBRE 2025.pdf",
  ccf: "/documents/CERTIFICADO CCF MARZO 2026.pdf",
  politica: "/documents/LEY DE PROTECCIÒN DE DATOS.pdf",
};

export function Footer({ locale }: FooterProps) {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tContact = useTranslations("contact.info");
  const localePath = (href: string) => `/${locale}${href}`;

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="nav-brand-mark" aria-hidden="true">
              <Image src="/images/logo_asopadres.png" alt="" width={56} height={56} />
            </span>
            <h4>{t("legal_name_title")}</h4>
            <p>{t("description")}</p>
            <p className="nit">{t("nit")} · {t("ccf")}</p>
          </div>

          <div className="footer-col">
            <h5>{t("nav_title")}</h5>
            <ul>
              <li><Link href={`${localePath("/")}#identidad`}>{tNav("about")}</Link></li>
              <li><Link href={localePath("/marco-legal")}>{tNav("legal")}</Link></li>
              <li><Link href={localePath("/proyecto-cancha")}>{tNav("project")}</Link></li>
              <li><Link href={localePath("/afiliate")}>{tNav("join")}</Link></li>
              <li><Link href={localePath("/comunicados")}>{tNav("news")}</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>{t("contact_title")}</h5>
            <ul>
              <li className="contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8l9 6 9-6M3 6h18v12H3z"/></svg>
                <a href={`mailto:${tContact("email")}`}>{tContact("email")}</a>
              </li>
              <li className="contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 5c0 9 7 16 16 16l3-3-5-2-2 2c-3 0-7-4-7-7l2-2-2-5z"/></svg>
                <a href={`https://wa.me/${tContact("phone").replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                  {tContact("phone")} (WhatsApp)
                </a>
              </li>
              <li className="contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s7-7 7-13a7 7 0 10-14 0c0 6 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/></svg>
                <span>{tContact("address")}</span>
              </li>
              <li className="contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 13a5 5 0 007 0l3-3a5 5 0 10-7-7l-1 1M14 11a5 5 0 00-7 0l-3 3a5 5 0 107 7l1-1"/></svg>
                <a href="https://www.ccsds.edu.co/" target="_blank" rel="noopener noreferrer">{t("school_link")}</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>{t("legal_title")}</h5>
            <ul>
              <li><a href={DOCS.politica} target="_blank" rel="noopener noreferrer">{t("legal_links.privacy")}</a></li>
              <li><a href={DOCS.estatutos} target="_blank" rel="noopener noreferrer">{t("legal_links.statutes")}</a></li>
              <li><a href={DOCS.rut} target="_blank" rel="noopener noreferrer">{t("legal_links.rut")}</a></li>
              <li><a href={DOCS.ccf} target="_blank" rel="noopener noreferrer">{t("legal_links.ccf")}</a></li>
              <li><Link href={localePath("/proteccion-datos")}>{t("legal_links.habeas_data")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copy">
            © {new Date().getFullYear()} ASOPADRES CCSDS. {t("independence")}
          </div>
          <div>asopadresccsds.org · ES · EN · FR</div>
        </div>
      </div>
    </footer>
  );
}
