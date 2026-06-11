import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { CheckCircle } from "lucide-react";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.pages.join" });
  return { title: t("title"), description: t("description") };
}

function AffiliationContent() {
  const t = useTranslations("affiliation");
  const benefits = t.raw("benefits") as string[];
  const grades = t.raw("form.grades") as string[];

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Context */}
        <div>
          <h2 className="font-serif text-xl font-bold text-foreground mb-4">
            {t("benefits_title")}
          </h2>
          <ul className="space-y-3 mb-10">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">{b}</span>
              </li>
            ))}
          </ul>

          {/* Legal identity */}
          <div className="bg-brand-blue rounded-xl p-5 text-white">
            <p className="text-xs uppercase tracking-widest text-white/50 mb-3">
              Datos Legales
            </p>
            <div className="space-y-1.5 text-sm">
              <p>NIT: <span className="text-brand-gold font-medium">901.740.513-1</span></p>
              <p>CCF: <span className="text-brand-gold font-medium">S0504820</span></p>
              <p className="text-white/60 text-xs mt-3">
                Entidad independiente del Colegio Campestre Santo Domingo Savio.
                Bajo vigilancia de la Gobernación de Cundinamarca.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div>
          <div className="bg-white rounded-2xl border border-border p-6 lg:p-8 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-foreground mb-6">
              {t("form_title")}
            </h2>

            <form action="/api/afiliate" method="POST" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {t("form.full_name")} *
                </label>
                <input
                  name="full_name"
                  required
                  placeholder={t("form.full_name_placeholder")}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {t("form.email")} *
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder={t("form.email_placeholder")}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {t("form.phone")} *
                  </label>
                  <input
                    name="phone"
                    required
                    placeholder={t("form.phone_placeholder")}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {t("form.id_number")}
                  </label>
                  <input
                    name="id_number"
                    placeholder={t("form.id_placeholder")}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {t("form.student_name")} *
                </label>
                <input
                  name="student_name"
                  required
                  placeholder={t("form.student_placeholder")}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {t("form.student_grade")}
                </label>
                <select
                  name="student_grade"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 bg-white"
                >
                  <option value="">{t("form.grade_placeholder")}</option>
                  {grades.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* Habeas Data */}
              <div className="bg-brand-cream rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    name="habeas_data"
                    id="habeas_afiliate"
                    required
                    className="mt-0.5"
                  />
                  <label
                    htmlFor="habeas_afiliate"
                    className="text-xs text-muted-foreground leading-relaxed"
                  >
                    {t("form.habeas_data_text")}
                    <a
                      href="../proteccion-datos"
                      className="text-brand-blue hover:underline mx-0.5"
                      target="_blank"
                    >
                      {t("form.habeas_data_link")}
                    </a>
                    {t("form.habeas_data_suffix")}
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-blue text-white font-medium text-sm rounded-xl hover:bg-brand-blue-dark transition-colors"
              >
                {t("form.submit")}
              </button>

              <p className="text-xs text-center text-muted-foreground">
                Tus datos están protegidos conforme a la Ley 1581 de 2012.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
    </div>
    </>
  );
}

export default async function AfiliatePage({ params }: Props) {
  await params;
  return <AffiliationContent />;
}
