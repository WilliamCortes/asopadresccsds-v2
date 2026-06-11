import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Calendar, ArrowRight } from "lucide-react";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.pages.news" });
  return { title: t("title"), description: t("description") };
}

// Placeholder data until Supabase is connected
const PLACEHOLDER_NEWS = [
  {
    slug: "asamblea-general-2025",
    category: "asambleas",
    date: "2025-04-01",
    title_es: "Asamblea General — Elección Junta Directiva 2025",
    title_en: "General Assembly — Board of Directors Election 2025",
    title_fr: "Assemblée Générale — Élection du Conseil d'Administration 2025",
    excerpt_es: "El 1 de abril de 2025 se celebró la Asamblea General en la que se eligió la nueva Junta Directiva de ASOPADRES CCSDS para el período vigente.",
    excerpt_en: "On April 1, 2025, the General Assembly was held to elect the new Board of Directors of ASOPADRES CCSDS.",
    excerpt_fr: "Le 1er avril 2025, l'Assemblée Générale s'est tenue pour élire le nouveau Conseil d'Administration de l'ASOPADRES CCSDS.",
  },
  {
    slug: "proyecto-cancha-cubierta",
    category: "proyectos",
    date: "2025-05-10",
    title_es: "Lanzamiento: Proyecto Cancha Cubierta",
    title_en: "Launch: Covered Court Project",
    title_fr: "Lancement : Projet Terrain Couvert",
    excerpt_es: "La Junta Directiva de ASOPADRES CCSDS presenta oficialmente el proyecto de construcción de la cancha cubierta, nuestro principal objetivo para 2025-2026.",
    excerpt_en: "The Board of Directors of ASOPADRES CCSDS officially presents the covered court construction project.",
    excerpt_fr: "Le Conseil d'Administration de l'ASOPADRES CCSDS présente officiellement le projet de construction du terrain couvert.",
  },
];

function NewsContent({ locale }: { locale: string }) {
  const t = useTranslations("news");
  const localeKey = `title_${locale}` as "title_es" | "title_en" | "title_fr";
  const excerptKey = `excerpt_${locale}` as "excerpt_es" | "excerpt_en" | "excerpt_fr";
  const categories = t.raw("categories") as Record<string, string>;

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
      {/* Category filter (static for now) */}
      <div className="flex flex-wrap gap-2 mb-10">
        {Object.entries(categories).map(([key, label]) => (
          <button
            key={key}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              key === "all"
                ? "bg-brand-blue text-white"
                : "bg-muted text-muted-foreground hover:bg-brand-blue/10 hover:text-brand-blue"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* News list */}
      <div className="space-y-6">
        {PLACEHOLDER_NEWS.map((post) => (
          <article
            key={post.slug}
            className="border border-border rounded-xl p-6 bg-white hover:border-brand-blue/30 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-medium bg-brand-blue/8 text-brand-blue px-2.5 py-1 rounded-full">
                {categories[post.category]}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(post.date).toLocaleDateString(
                  locale === "es" ? "es-CO" : locale === "fr" ? "fr-FR" : "en-US",
                  { year: "numeric", month: "long", day: "numeric" }
                )}
              </span>
            </div>
            <h2 className="font-serif text-xl font-bold text-foreground mb-2">
              {post[localeKey] ?? post.title_es}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              {post[excerptKey] ?? post.excerpt_es}
            </p>
            <a
              href={`/${locale}/comunicados/${post.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue hover:gap-2.5 transition-all"
            >
              {t("read_more")} <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </article>
        ))}
      </div>
    </div>
    </div>
    </>
  );
}

export default async function NewsPage({ params }: Props) {
  const { locale } = await params;
  return <NewsContent locale={locale} />;
}
