import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { Donar } from "@/components/sections/Donar";
import { FaqAccordion } from "@/components/v2/FaqAccordion";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.pages.project" });
  return { title: t("title"), description: t("description") };
}

export default async function ProyectoCanchaPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "project_v2" });
  const localePath = (href: string) => `/${locale}${href}`;

  const faqItems = [1, 2, 3, 4, 5].map((n) => ({
    q: t(`faq.q${n}`),
    a: t(`faq.a${n}`),
  }));

  const timelineSteps = [
    { num: t("timeline.step1_num"), title: t("timeline.step1_title"), body: t("timeline.step1_body"), status: t("timeline.step1_status"), state: "is-done" },
    { num: t("timeline.step2_num"), title: t("timeline.step2_title"), body: t("timeline.step2_body"), status: t("timeline.step2_status"), state: "is-active" },
    { num: t("timeline.step3_num"), title: t("timeline.step3_title"), body: t("timeline.step3_body"), status: t("timeline.step3_status"), state: "" },
    { num: t("timeline.step4_num"), title: t("timeline.step4_title"), body: t("timeline.step4_body"), status: t("timeline.step4_status"), state: "" },
  ];

  const specs = [
    { k: t("specs.area_k"), v: t("specs.area_v") },
    { k: t("specs.height_k"), v: t("specs.height_v") },
    { k: t("specs.primary_k"), v: t("specs.primary_v") },
    { k: t("specs.secondary_k"), v: t("specs.secondary_v") },
    { k: t("specs.capacity_k"), v: t("specs.capacity_v") },
    { k: t("specs.schedule_k"), v: t("specs.schedule_v") },
    { k: t("specs.budget_k"), v: t("specs.budget_v") },
  ];

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="crumbs reveal is-in">
            <Link href={localePath("/")}>{t("hero.breadcrumb_home")}</Link>
            <span>/</span>
            <span>{t("hero.breadcrumb_current")}</span>
          </div>
          <span className="eyebrow reveal is-in">{t("hero.eyebrow")}</span>
          <h1 className="reveal delay-1 is-in">
            {t.rich("hero.title", { em: (chunks) => <em>{chunks}</em> })}
          </h1>
          <p className="lead reveal delay-2 is-in">{t("hero.lead")}</p>

          <div className="cancha-hero-img reveal delay-3 is-in">
            <Image
              src="/images/proyecto_cancha_2.jpg"
              alt={t("hero.breadcrumb_current")}
              fill
              priority
              className="img-cover"
            />
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--blanco)", paddingBlock: "clamp(56px,7vw,96px)" }}>
        <div className="container">
          <div className="proyecto-progress reveal" style={{ margin: "0 auto" }}>
            <div className="progress-meta">
              <div>
                <div className="meta-label">{t("progress.goal_label")}</div>
                <strong>$500.000.000 COP</strong>
              </div>
              <div style={{ textAlign: "center" }}>
                <div className="meta-label">{t("progress.raised_label")}</div>
                <strong style={{ color: "var(--dorado-oscuro)" }}>$0</strong>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="meta-label">{t("progress.beneficiaries_label")}</div>
                <strong>{t("progress.beneficiaries_value")}</strong>
              </div>
            </div>
            <div className="progress-bar" role="progressbar" aria-valuenow={0} aria-valuemin={0} aria-valuemax={100}>
              <div className="progress-fill" data-fill="2"></div>
            </div>
            <div className="progress-bottom">
              <span>{t("progress.campaign_start")}</span>
              <span className="progress-percent">{t("progress.percent")}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section specs">
        <div className="container">
          <div className="specs-grid">
            <div className="specs-left reveal">
              <span className="eyebrow">{t("specs.eyebrow")}</span>
              <h2 style={{ marginTop: 16 }}>{t("specs.title")}</h2>
              <p>{t("specs.p1")}</p>
              <p>{t("specs.p2")}</p>
            </div>

            <ul className="specs-list reveal delay-1">
              {specs.map(({ k, v }) => (
                <li key={k}>
                  <span className="k">{k}</span>
                  <span className="v">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section timeline-section">
        <div className="container">
          <div className="section-head reveal" style={{ textAlign: "left", marginBottom: 0 }}>
            <span className="eyebrow">{t("timeline.eyebrow")}</span>
            <h2 style={{ textAlign: "left", margin: "14px 0", maxWidth: "24ch" }}>{t("timeline.title")}</h2>
            <p style={{ margin: 0, maxWidth: "56ch" }}>{t("timeline.lead")}</p>
          </div>

          <div className="timeline">
            {timelineSteps.map((step, i) => (
              <div key={step.num} className={`tl-step ${step.state} reveal ${i > 0 ? `delay-${i}` : ""}`}>
                <div className="num">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
                <span className="status">{step.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Donar eyebrow={t("donar.eyebrow")} title={t("donar.title")} lead={t("donar.lead")} />

      <section className="section faq-section">
        <div className="container narrow">
          <div className="section-head reveal" style={{ textAlign: "center", marginBottom: 16 }}>
            <span className="eyebrow no-rule" style={{ display: "inline-flex" }}>{t("faq.eyebrow")}</span>
            <h2 style={{ marginTop: 14 }}>{t("faq.title")}</h2>
          </div>

          <FaqAccordion items={faqItems} />
        </div>
      </section>
    </>
  );
}
