import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.pages.about" });
  return { title: t("title"), description: t("description") };
}

function BoardSection() {
  const t = useTranslations("board");
  const members = t.raw("members") as Array<{ name: string; role: string }>;

  return (
    <div className="mt-16">
      <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
        {t("title")}
      </h2>
      <p className="text-muted-foreground text-sm mb-8">{t("subtitle")}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member, i) => (
          <div
            key={member.name}
            className="border border-border rounded-lg p-4 bg-white"
          >
            <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center mb-3">
              <span className="text-brand-blue font-bold text-sm">
                {member.name.charAt(0)}
              </span>
            </div>
            <p className="font-semibold text-sm text-foreground leading-tight">
              {member.name}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{member.role}</p>
            {i === 0 && (
              <span className="inline-block mt-2 text-xs bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded-full font-medium">
                Representante Legal
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function AboutContent({ locale }: { locale: string }) {
  const t = useTranslations("about_preview");
  const tCommon = useTranslations("common");

  return (
    <>
    <section className="simple-page-hero">
      <div className="container narrow">
        <span className="eyebrow">ASOPADRES CCSDS</span>
        <h1>{t("title")}</h1>
      </div>
    </section>
    <div className="section content-section">
    <div className="container">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left: Image + Legal badges */}
        <div>
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-6">
            <Image
              src="/images/colegio_2.png"
              alt="Colegio Campestre Santo Domingo Savio"
              fill
              className="object-cover"
            />
          </div>
          {/* Legal identity strip */}
          <div className="bg-brand-blue rounded-xl p-5 text-white space-y-2">
            <p className="text-xs uppercase tracking-widest text-white/50 mb-3">
              Identidad Jurídica
            </p>
            <p className="text-sm font-medium">
              NIT: <span className="text-brand-gold">901.740.513-1</span>
            </p>
            <p className="text-sm font-medium">
              Inscripción CCF:{" "}
              <span className="text-brand-gold">S0504820</span>
            </p>
            <p className="text-sm font-medium">
              Vigente hasta:{" "}
              <span className="text-brand-gold">23 de abril de 2040</span>
            </p>
            <p className="text-sm font-medium">
              Vigilancia:{" "}
              <span className="text-white/80">
                Gobernación de Cundinamarca
              </span>
            </p>
            <p className="text-xs text-brand-gold mt-3 font-medium border-t border-white/10 pt-3">
              {tCommon("independent_entity")}
            </p>
          </div>
        </div>

        {/* Right: Content */}
        <div>
          <div className="prose prose-slate max-w-none space-y-4 text-muted-foreground leading-relaxed">
            <p>
              La Asociación de Padres de Familia del Colegio Campestre Santo
              Domingo Savio fue fundada el <strong>19 de mayo de 2023</strong>{" "}
              por 16 familias que vieron la necesidad de tener una organización
              formal que representara los intereses de los padres ante la
              comunidad educativa.
            </p>
            <p>
              Somos una{" "}
              <strong>Entidad Sin Ánimo de Lucro (ESAL)</strong> constituida
              conforme al Decreto 1286 de 2005 y registrada ante la Cámara de
              Comercio de Facatativá.
            </p>
            <p>
              Nuestra razón de ser es{" "}
              <strong>
                fortalecer la relación entre las familias y el proceso educativo
              </strong>
              , apoyar iniciativas que mejoren las condiciones del colegio y
              velar por el bienestar de todos los estudiantes.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="border-l-4 border-brand-gold pl-5">
              <h3 className="font-serif font-bold text-lg text-foreground mb-2">
                Misión
              </h3>
              <p className="text-muted-foreground">
                Representar y acompañar a las familias del CCSDS, promoviendo
                su participación activa en la educación de sus hijos, dentro
                del marco de la normatividad colombiana vigente.
              </p>
            </div>
            <div className="border-l-4 border-brand-blue pl-5">
              <h3 className="font-serif font-bold text-lg text-foreground mb-2">
                Visión
              </h3>
              <p className="text-muted-foreground">
                Ser una asociación modelo en Cundinamarca, reconocida por su
                transparencia, gestión efectiva y compromiso con el desarrollo
                integral de los estudiantes del CCSDS.
              </p>
            </div>
          </div>

          <BoardSection />
        </div>
      </div>
    </div>
    </div>
    </>
  );
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  return <AboutContent locale={locale} />;
}
