"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Script from "next/script";

interface DonationCardProps {
  currency: "cop" | "intl";
}

interface WompiCheckoutResult {
  transaction?: { id: string; status: string };
}

interface PayPalActions {
  order: {
    create: (config: object) => Promise<string>;
    capture: () => Promise<unknown>;
  };
}

declare global {
  interface Window {
    WidgetCheckout?: new (config: {
      currency: string;
      amountInCents: number;
      reference: string;
      publicKey: string;
      signature: { integrity: string };
      redirectUrl: string;
    }) => { open: (callback: (result: WompiCheckoutResult) => void) => void };
    paypal?: {
      Buttons: (options: {
        style?: Record<string, unknown>;
        createOrder: (data: unknown, actions: PayPalActions) => Promise<string>;
        onApprove: (data: unknown, actions: PayPalActions) => Promise<unknown>;
      }) => { render: (container: HTMLElement) => void };
    };
  }
}

const COP_AMOUNTS = [50000, 100000, 250000, 500000];
const INTL_AMOUNTS = [20, 50, 100, 250];

export function DonationCard({ currency }: DonationCardProps) {
  const t = useTranslations("home_v2.donar");
  const amounts = currency === "cop" ? COP_AMOUNTS : INTL_AMOUNTS;
  const [active, setActive] = useState<number | null>(amounts[1]);
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);

  const formatAmount = (n: number) =>
    currency === "cop" ? `$${n.toLocaleString("es-CO")}` : `€${n}`;

  const isCop = currency === "cop";

  const amountRef = useRef(amounts[1]);
  const paypalContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    amountRef.current = active ?? (parseInt(custom, 10) || 0);
  }, [active, custom]);

  const handlePaypalLoad = () => {
    if (!window.paypal || !paypalContainerRef.current) return;
    paypalContainerRef.current.innerHTML = "";
    window.paypal
      .Buttons({
        style: { layout: "horizontal", color: "gold", tagline: false, height: 45 },
        createOrder: (_data, actions) =>
          actions.order.create({
            purchase_units: [
              {
                description: "Donación - Cancha Cubierta ASOPADRES CCSDS",
                amount: { currency_code: "EUR", value: amountRef.current.toFixed(2) },
              },
            ],
          }),
        onApprove: (_data, actions) => actions.order.capture(),
      })
      .render(paypalContainerRef.current);
  };

  const handleDonate = async () => {
    const amount = active ?? parseInt(custom, 10);
    if (!amount || amount <= 0) return;

    if (!isCop) return;

    setLoading(true);
    try {
      const amountInCents = amount * 100;
      const reference = `DON-CANCHA-${Date.now()}`;

      const res = await fetch("/api/checkout/wompi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountInCents, currency: "COP", reference }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout error");

      if (!window.WidgetCheckout) throw new Error("Wompi widget not loaded");

      const checkout = new window.WidgetCheckout({
        currency: "COP",
        amountInCents,
        reference,
        publicKey: data.publicKey,
        signature: { integrity: data.signature },
        redirectUrl: window.location.href,
      });

      checkout.open((result) => console.log("Wompi transaction:", result.transaction));
      setLoading(false);
    } catch (error) {
      console.error("Wompi checkout error:", error);
      setLoading(false);
    }
  };

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

      {isCop ? (
        <button type="button" className="btn btn-primary" onClick={handleDonate} disabled={loading}>
          {t("cop_cta")}
          <svg className="arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
        </button>
      ) : (
        <div ref={paypalContainerRef} className="paypal-button-container" />
      )}

      {isCop && <Script src="https://checkout.wompi.co/widget.js" strategy="lazyOnload" />}
      {!isCop && (
        <Script
          src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=EUR`}
          strategy="lazyOnload"
          onLoad={handlePaypalLoad}
        />
      )}
    </article>
  );
}
