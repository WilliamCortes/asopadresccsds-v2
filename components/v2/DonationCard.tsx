"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface DonationCardProps {
  currency: "cop" | "intl";
}

const COP_AMOUNTS = [50000, 100000, 250000, 500000];
const INTL_AMOUNTS = [20, 50, 100, 250];

export function DonationCard({ currency }: DonationCardProps) {
  const t = useTranslations("home_v2.donar");
  const amounts = currency === "cop" ? COP_AMOUNTS : INTL_AMOUNTS;
  const [active, setActive] = useState<number | null>(amounts[1]);
  const [custom, setCustom] = useState("");

  const formatAmount = (n: number) =>
    currency === "cop" ? `$${n.toLocaleString("es-CO")}` : `€${n}`;

  const isCop = currency === "cop";

  return (
    <article className={`dcard ${isCop ? "" : "intl "}reveal delay-${isCop ? "1" : "2"}`} data-currency={isCop ? "COP" : "EUR"}>
      <div className={`dcard-flag ${isCop ? "colombia" : "world"}`} aria-hidden="true">
        {isCop ? "" : "€"}
      </div>
      <h3>{t(isCop ? "cop_title" : "intl_title")}</h3>
      <p className="sub">{t(isCop ? "cop_sub" : "intl_sub")}</p>

      <div className="amount-row" role="radiogroup" aria-label={t(isCop ? "cop_title" : "intl_title")}>
        {amounts.map((amount) => (
          <button
            key={amount}
            type="button"
            className={`amount-chip ${active === amount ? "is-active" : ""}`}
            onClick={() => {
              setActive(amount);
              setCustom("");
            }}
          >
            {formatAmount(amount)}
          </button>
        ))}
      </div>
      <input
        className="amount-custom"
        type="text"
        inputMode="numeric"
        placeholder={t(isCop ? "cop_custom_placeholder" : "intl_custom_placeholder")}
        aria-label={t(isCop ? "cop_custom_placeholder" : "intl_custom_placeholder")}
        value={custom}
        onFocus={() => setActive(null)}
        onChange={(e) => setCustom(e.target.value.replace(/[^\d]/g, ""))}
      />

      <div className="dcard-meta">
        <span className="dcard-meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7" /></svg>
          {t(isCop ? "cop_meta1" : "intl_meta1")}
        </span>
        <span className="dcard-meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7" /></svg>
          {t(isCop ? "cop_meta2" : "intl_meta2")}
        </span>
      </div>

      <button type="button" className="btn btn-primary">
        {t(isCop ? "cop_cta" : "intl_cta")}
        <svg className="arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
      </button>
    </article>
  );
}
