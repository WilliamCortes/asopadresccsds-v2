import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Shield, ChevronRight } from "lucide-react";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.pages.privacy" });
  return { title: t("title"), description: t("description") };
}

function PrivacyContent() {
  const t = useTranslations("privacy");
  const purposes = t.raw("sections.purposes") as string[];
  const rights = t.raw("sections.rights") as string[];

  const sections = [
    { title: t("sections.responsible_title"), body: t("sections.responsible_body") },
    { title: t("sections.contact_title"), body: t("sections.contact_body") },
    { title: t("sections.area_title"), body: t("sections.area_body") },
    { title: t("sections.procedure_title"), body: t("sections.procedure_body") },
    { title: t("sections.validity_title"), body: t("sections.validity_body") },
    { title: t("sections.minors_title"), body: t("sections.minors_body") },
  ];

  return (
    <>
    <section className="simple-page-hero">
      <div className="container narrow">
        <span className="eyebrow">
          <Shield className="h-4 w-4 inline-block mr-1.5 align-text-bottom" />
          ASOPADRES CCSDS
        </span>
        <h1>{t("title")}</h1>
        <p className="lead">{t("subtitle")}</p>
        <p className="lead" style={{ fontSize: 13, opacity: 0.7, marginTop: 8 }}>
          {t("last_updated")}: 1 de mayo de 2026 · {t("version")}
        </p>
      </div>
    </section>
    <div className="section content-section">
    <div className="container narrow">
      {/* GDPR Notice */}
      <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-xl p-5 mb-10">
        <p className="text-sm font-semibold text-brand-blue mb-1">
          {t("sections.gdpr_title")}
        </p>
        <p className="text-sm text-foreground/70 leading-relaxed">
          {t("sections.gdpr_body")}
        </p>
      </div>

      {/* Sections 3 & 4 with lists */}
      <div className="mb-8">
        <h2 className="font-serif text-xl font-bold text-foreground mb-4">
          {t("sections.purposes_title")}
        </h2>
        <ul className="space-y-2">
          {purposes.map((p) => (
            <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
              <ChevronRight className="h-4 w-4 text-brand-gold mt-0.5 flex-shrink-0" />
              {p}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="font-serif text-xl font-bold text-foreground mb-4">
          {t("sections.rights_title")}
        </h2>
        <ul className="space-y-2">
          {rights.map((r) => (
            <li key={r} className="flex items-start gap-2 text-sm text-muted-foreground">
              <ChevronRight className="h-4 w-4 text-brand-gold mt-0.5 flex-shrink-0" />
              {r}
            </li>
          ))}
        </ul>
      </div>

      {/* Other sections */}
      <div className="space-y-6">
        {sections.map(({ title, body }) => (
          <div key={title} className="border-b border-border pb-6">
            <h2 className="font-serif text-xl font-bold text-foreground mb-3">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      {/* ARCO Form */}
      <div className="mt-12 bg-brand-cream rounded-2xl p-8">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
          {t("arco_title")}
        </h2>
        <p className="text-muted-foreground text-sm mb-6">{t("arco_subtitle")}</p>
        <ARCOForm />
      </div>
    </div>
    </div>
    </>
  );
}

function ARCOForm() {
  const t = useTranslations("privacy.arco_form");
  const options = t.raw("type_options") as string[];

  return (
    <form action="/api/arco" method="POST" className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            {t("name")} *
          </label>
          <input
            name="name"
            required
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            {t("id")} *
          </label>
          <input
            name="id"
            required
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 bg-white"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          {t("email")} *
        </label>
        <input
          name="email"
          type="email"
          required
          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 bg-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          {t("type")} *
        </label>
        <select
          name="type"
          required
          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 bg-white"
        >
          <option value="">—</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          {t("description")} *
        </label>
        <textarea
          name="description"
          required
          rows={4}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 bg-white resize-none"
        />
      </div>
      <button
        type="submit"
        className="w-full sm:w-auto px-6 py-2.5 bg-brand-blue text-white text-sm font-medium rounded-lg hover:bg-brand-blue-dark transition-colors"
      >
        {t("submit")}
      </button>
    </form>
  );
}

export default async function PrivacyPage({ params }: Props) {
  await params;
  return <PrivacyContent />;
}
