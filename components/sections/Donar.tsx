import { useTranslations } from "next-intl";
import { DonationCard } from "@/components/v2/DonationCard";

interface DonarProps {
  eyebrow?: string;
  title?: string;
  lead?: string;
}

export function Donar({ eyebrow, title, lead }: DonarProps) {
  const t = useTranslations("home_v2.donar");

  return (
    <section className="section donar" id="donar">
      <div className="container">
        <div className="donar-head reveal">
          <span className="eyebrow">{eyebrow ?? t("eyebrow")}</span>
          <h2>{title ?? t("title")}</h2>
          <p>{lead ?? t("lead")}</p>
        </div>

        <div className="donar-grid">
          <DonationCard currency="cop" />
          <DonationCard currency="intl" />
        </div>

        <div className="donar-legal reveal">
          <p>{t("legal1")}</p>
          <p>{t("legal2")}</p>
        </div>
      </div>
    </section>
  );
}
