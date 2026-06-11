import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en", "fr"],
  defaultLocale: "es",
  pathnames: {
    "/": "/",
    "/quienes-somos": {
      es: "/quienes-somos",
      en: "/about-us",
      fr: "/qui-sommes-nous",
    },
    "/marco-legal": {
      es: "/marco-legal",
      en: "/legal-framework",
      fr: "/cadre-juridique",
    },
    "/proyecto-cancha": {
      es: "/proyecto-cancha",
      en: "/covered-court-project",
      fr: "/projet-terrain-couvert",
    },
    "/afiliate": {
      es: "/afiliate",
      en: "/join-us",
      fr: "/nous-rejoindre",
    },
    "/comunicados": {
      es: "/comunicados",
      en: "/news",
      fr: "/actualites",
    },
    "/comunicados/[slug]": {
      es: "/comunicados/[slug]",
      en: "/news/[slug]",
      fr: "/actualites/[slug]",
    },
    "/proteccion-datos": {
      es: "/proteccion-datos",
      en: "/data-protection",
      fr: "/protection-des-donnees",
    },
    "/contactenos": {
      es: "/contactenos",
      en: "/contact-us",
      fr: "/contactez-nous",
    },
  },
});

export type Locale = (typeof routing.locales)[number];
export type Pathnames = keyof typeof routing.pathnames;
