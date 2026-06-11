import type { MetadataRoute } from "next";

const BASE_URL = "https://asopadresccsds.org";
const LOCALES = ["es", "en", "fr"] as const;

const PAGES = [
  { es: "/", en: "/", fr: "/" },
  { es: "/quienes-somos", en: "/about-us", fr: "/qui-sommes-nous" },
  { es: "/marco-legal", en: "/legal-framework", fr: "/cadre-juridique" },
  { es: "/proyecto-cancha", en: "/covered-court-project", fr: "/projet-terrain-couvert" },
  { es: "/afiliate", en: "/join-us", fr: "/nous-rejoindre" },
  { es: "/comunicados", en: "/news", fr: "/actualites" },
  { es: "/proteccion-datos", en: "/data-protection", fr: "/protection-des-donnees" },
  { es: "/contactenos", en: "/contact-us", fr: "/contactez-nous" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of PAGES) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}${page[locale]}`,
        lastModified: new Date(),
        changeFrequency: page.es === "/" ? "weekly" : "monthly",
        priority: page.es === "/" ? 1.0 : page.es === "/proyecto-cancha" ? 0.9 : 0.7,
        alternates: {
          languages: {
            "es-CO": `${BASE_URL}/es${page.es}`,
            en: `${BASE_URL}/en${page.en}`,
            fr: `${BASE_URL}/fr${page.fr}`,
          },
        },
      });
    }
  }

  return entries;
}
