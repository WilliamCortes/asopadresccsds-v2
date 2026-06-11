import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { FileText, Download, ExternalLink, AlertTriangle, CheckCircle } from "lucide-react";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.pages.legal" });
  return { title: t("title"), description: t("description") };
}

const DOC_FILES: Record<string, string> = {
  estatutos: "/documents/ESTATUTOS ASOPADRES VIGENTE 2024.pdf",
  rut: "/documents/RUT ASOPADRES SEPTIEMBRE 2025.pdf",
  ccf: "/documents/CERTIFICADO CCF MARZO 2026.pdf",
  reglamento: "/documents/REGLAMENTO SESION ASAMBLEAS.pdf",
  politica: "/documents/LEY DE PROTECCIÒN DE DATOS.pdf",
};

function LegalContent() {
  const t = useTranslations("legal");
  const norms = t.raw("norms") as Array<{ norm: string; description: string }>;
  const docs = t.raw("docs") as Array<{ key: string; label: string; description: string }>;
  const prohibitions = t.raw("prohibitions") as string[];

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
    <div className="container narrow">
      {/* Independence Notice */}
      <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-xl p-6 mb-12">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-brand-blue mt-0.5 flex-shrink-0" />
          <div>
            <h2 className="font-semibold text-brand-blue mb-2">
              {t("independence_title")}
            </h2>
            <p className="text-sm text-foreground/70 leading-relaxed">
              {t("independence_body")}
            </p>
          </div>
        </div>
      </div>

      {/* Applicable Norms */}
      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
          {t("norms_title")}
        </h2>
        <div className="space-y-3">
          {norms.map(({ norm, description }) => (
            <div
              key={norm}
              className="flex gap-4 p-4 rounded-lg border border-border bg-white"
            >
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-brand-gold mt-2" />
              <div>
                <p className="font-semibold text-sm text-foreground">{norm}</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Documents */}
      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
          {t("docs_title")}
        </h2>
        <p className="text-muted-foreground text-sm mb-6">{t("docs_subtitle")}</p>
        <div className="space-y-3">
          {docs.map(({ key, label, description }) => (
            <div
              key={key}
              className="flex items-center justify-between p-4 rounded-xl border border-border bg-white hover:border-brand-blue/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-brand-blue/8 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-brand-blue" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                </div>
              </div>
              <a
                href={DOC_FILES[key] ?? "#"}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue hover:text-brand-blue-dark transition-colors flex-shrink-0 ml-4"
              >
                <Download className="h-4 w-4" />
                {t("download")}
              </a>
            </div>
          ))}
        </div>

        {/* CCF verification link */}
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <ExternalLink className="h-4 w-4" />
          <span>
            Verificación en línea:{" "}
            <a
              href="https://certificados.confecamaras.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-blue hover:underline"
            >
              {t("verify_ccf")}
            </a>
          </span>
        </div>
      </section>

      {/* Prohibitions */}
      <section>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h2 className="font-semibold text-amber-800 mb-3">
                {t("prohibition_title")}
              </h2>
              <ul className="space-y-2">
                {prohibitions.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-amber-700">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
    </div>
    </>
  );
}

export default async function LegalPage({ params }: Props) {
  await params;
  return <LegalContent />;
}
