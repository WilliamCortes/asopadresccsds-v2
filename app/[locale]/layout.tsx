import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond, EB_Garamond } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { V2Effects } from "@/components/v2/Effects";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-ebgaramond",
  display: "swap",
});

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const EU_LOCALES = ["fr"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.pages.home" });
  const tMeta = await getTranslations({ locale, namespace: "meta" });

  const BASE_URL = "https://asopadresccsds.org";

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        "es-CO": `${BASE_URL}/es`,
        en: `${BASE_URL}/en`,
        fr: `${BASE_URL}/fr`,
        "x-default": `${BASE_URL}/es`,
      },
    },
    openGraph: {
      siteName: tMeta("siteName"),
      type: "website",
      locale:
        locale === "es" ? "es_CO" : locale === "fr" ? "fr_FR" : "en_US",
      alternateLocale: ["es_CO", "en_US", "fr_FR"].filter(
        (l) =>
          l !==
          (locale === "es" ? "es_CO" : locale === "fr" ? "fr_FR" : "en_US")
      ),
      images: [
        {
          url: `${BASE_URL}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "ASOPADRES CCSDS — Asociación de Padres de Familia",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    other: {
      "geo.region": "CO-CUN",
      "geo.placename": "Anolaima, Cundinamarca, Colombia",
      ICBM: "4.7667, -74.4667",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "es" | "en" | "fr")) {
    notFound();
  }

  const messages = await getMessages();
  const isEU = EU_LOCALES.includes(locale);

  // Organization Schema.org structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": ["NGO", "Organization"],
    "@id": "https://asopadresccsds.org/#organization",
    name:
      locale === "es"
        ? "Asociación de Padres de Familia CCSDS"
        : locale === "fr"
        ? "Association de Parents d'Élèves CCSDS"
        : "Parents Association CCSDS",
    legalName:
      "ASOCIACION DE PADRES DE FAMILIA DEL COLEGIO CAMPESTRE SANTO DOMINGO SAVIO",
    alternateName: "ASOPADRES CCSDS",
    slogan:
      locale === "es"
        ? "Familias que construyen el futuro de sus hijos."
        : locale === "fr"
        ? "Des familles qui construisent l'avenir de leurs enfants."
        : "Families building their children's future.",
    taxID: "901.740.513-1",
    foundingDate: "2023-05-19",
    url: `https://asopadresccsds.org/${locale}`,
    logo: "https://asopadresccsds.org/images/logo_asopadres.png",
    image: "https://asopadresccsds.org/images/og-image.jpg",
    contactPoint: {
      "@type": "ContactPoint",
      email: "asociaciondepadresdefamilia@ccsds.edu.co",
      telephone: "+573204413330",
      contactType: "customer support",
      availableLanguage: ["Spanish", "English", "French"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Vereda La María, Sitio Los Veleños",
      addressLocality: "Anolaima",
      addressRegion: "Cundinamarca",
      addressCountry: "CO",
    },
    areaServed: [
      { "@type": "Country", name: "Colombia" },
      { "@type": "AdministrativeArea", name: "European Union" },
    ],
    knowsAbout: [
      "Educación",
      "Padres de familia",
      "Colegio Campestre Santo Domingo Savio",
      "ESAL Colombia",
    ],
    memberOf: {
      "@type": "Organization",
      name: "Colegio Campestre Santo Domingo Savio",
      url: "https://www.ccsds.edu.co",
    },
    potentialAction: {
      "@type": "DonateAction",
      name:
        locale === "es"
          ? "Donar al proyecto de la cancha cubierta"
          : locale === "fr"
          ? "Faire un don pour le terrain de sport couvert"
          : "Donate to the covered sports court project",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          locale === "es"
            ? "https://asopadresccsds.org/es/proyecto-cancha"
            : locale === "fr"
            ? "https://asopadresccsds.org/fr/projet-terrain-couvert"
            : "https://asopadresccsds.org/en/covered-court-project",
        actionPlatform: [
          "https://schema.org/DesktopWebPlatform",
          "https://schema.org/MobileWebPlatform",
        ],
      },
    },
  };

  // WebSite Schema.org structured data
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://asopadresccsds.org/#website",
    url: "https://asopadresccsds.org",
    name: "ASOPADRES CCSDS",
    publisher: { "@id": "https://asopadresccsds.org/#organization" },
    inLanguage: locale,
  };

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${cormorant.variable} ${ebGaramond.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
        />
      </head>
      <body className="v2 font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <Header locale={locale} />
          <main id="main">{children}</main>
          <Footer locale={locale} />
          <CookieBanner locale={locale} isEU={isEU} />
          <V2Effects />
          <WhatsAppButton />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
