import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, ExternalLink } from "lucide-react";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.pages.contact" });
  return { title: t("title"), description: t("description") };
}

function ContactContent() {
  const t = useTranslations("contact");

  return (
    <>
    <section className="simple-page-hero">
      <div className="container narrow">
        <span className="eyebrow">ASOPADRES CCSDS</span>
        <h1>{t("title")}</h1>
        <p className="lead">{t("subtitle")}</p>
      </div>
    </section>
    <div className="section content-section">
    <div className="container">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact info */}
        <div className="space-y-6">
          <h2 className="font-serif text-xl font-bold text-foreground">
            Información de contacto
          </h2>

          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-border">
              <div className="w-10 h-10 rounded-lg bg-brand-blue/8 flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5 text-brand-blue" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  {t("info.email_label")}
                </p>
                <a
                  href={`mailto:${t("info.email")}`}
                  className="text-sm font-medium text-brand-blue hover:underline"
                >
                  {t("info.email")}
                </a>
              </div>
            </div>

            {/* Phone 1 */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-border">
              <div className="w-10 h-10 rounded-lg bg-brand-blue/8 flex items-center justify-center flex-shrink-0">
                <Phone className="h-5 w-5 text-brand-blue" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  {t("info.phone_label")}
                </p>
                <a
                  href={`https://wa.me/${t("info.phone").replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-brand-blue hover:underline inline-flex items-center gap-1"
                >
                  {t("info.phone")}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Phone 2 */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-border">
              <div className="w-10 h-10 rounded-lg bg-brand-blue/8 flex items-center justify-center flex-shrink-0">
                <Phone className="h-5 w-5 text-brand-blue" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  {t("info.phone2_label")}
                </p>
                <a
                  href={`https://wa.me/${t("info.phone2").replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-brand-blue hover:underline inline-flex items-center gap-1"
                >
                  {t("info.phone2")}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-border">
              <div className="w-10 h-10 rounded-lg bg-brand-blue/8 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-brand-blue" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  {t("info.address_label")}
                </p>
                <a
                  href="https://goo.gl/maps/n9jAyEEL8UkmELLz7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground hover:text-brand-blue transition-colors inline-flex items-start gap-1"
                >
                  {t("info.address")}
                </a>
              </div>
            </div>

            {/* Response time */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-gold/10">
              <Clock className="h-4 w-4 text-brand-gold flex-shrink-0" />
              <p className="text-sm text-foreground/70">{t("info.response_time")}</p>
            </div>
          </div>

          {/* Watchdog */}
          <div className="border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">{t("info.watchdog_label")}:</span>{" "}
              {t("info.watchdog")}
            </p>
          </div>
        </div>

        {/* Contact form */}
        <div>
          <h2 className="font-serif text-xl font-bold text-foreground mb-6">
            Envíanos un mensaje
          </h2>
          <ContactForm />
        </div>
      </div>

      {/* Map */}
      <div className="mt-14 rounded-2xl overflow-hidden border border-border h-72 lg:h-96">
        <iframe
          src="https://maps.google.com/maps?q=Anolaima+Cundinamarca+Colombia&t=&z=13&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación ASOPADRES CCSDS — Anolaima, Cundinamarca"
        />
      </div>
    </div>
    </div>
    </>
  );
}

function ContactForm() {
  const t = useTranslations("contact.form");

  return (
    <form action="/api/contact" method="POST" className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          {t("name")} *
        </label>
        <input
          name="name"
          required
          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          {t("email")} *
        </label>
        <input
          name="email"
          type="email"
          required
          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          {t("subject")}
        </label>
        <input
          name="subject"
          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          {t("message")} *
        </label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder={t("message_placeholder")}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 resize-none"
        />
      </div>
      <div className="flex items-start gap-2">
        <input type="checkbox" name="habeas_data" id="habeas_contact" required className="mt-0.5" />
        <label htmlFor="habeas_contact" className="text-xs text-muted-foreground">
          {t("habeas_data_text")}
          <Link href="/es/proteccion-datos" className="text-brand-blue hover:underline ml-0.5">
            {t("habeas_data_link")}
          </Link>
        </label>
      </div>
      <button
        type="submit"
        className="w-full px-6 py-3 bg-brand-blue text-white text-sm font-medium rounded-lg hover:bg-brand-blue-dark transition-colors"
      >
        {t("submit")}
      </button>
    </form>
  );
}

export default async function ContactPage({ params }: Props) {
  await params;
  return <ContactContent />;
}
