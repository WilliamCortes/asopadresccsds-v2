import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { Problema } from "@/components/sections/Problema";
import { ProjectTeaser } from "@/components/sections/ProjectTeaser";
import { StatsBar } from "@/components/sections/StatsBar";
import { Gallery } from "@/components/sections/Gallery";
import { Donar } from "@/components/sections/Donar";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.pages.home" });
  return { title: t("title"), description: t("description") };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  return (
    <>
      <Hero locale={locale} />
      <AboutPreview />
      <Problema />
      <ProjectTeaser locale={locale} />
      <StatsBar />
      <Gallery />
      <Donar />
    </>
  );
}
