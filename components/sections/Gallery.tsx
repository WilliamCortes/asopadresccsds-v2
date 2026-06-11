import { useTranslations } from "next-intl";
import Image from "next/image";

const TILES = [
  { className: "t1", src: "/images/ninos_gradas.jpg", titleKey: "tile1_title", subKey: "tile1_sub" },
  { className: "t2", src: "/images/danzas_cachipay.jpg", titleKey: "tile2_title", subKey: "tile2_sub" },
  { className: "t3", src: "/images/volando_cometa.jpg", titleKey: "tile3_title", subKey: "tile3_sub" },
  { className: "t4", src: "/images/evento_teatro.jpg", titleKey: "tile4_title", subKey: "tile4_sub" },
  { className: "t5", src: "/images/papa_hijo.jpg", titleKey: "tile5_title", subKey: "tile5_sub" },
  { className: "t6", src: "/images/personas_bailando.jpg", titleKey: "tile6_title", subKey: "tile6_sub" },
] as const;

export function Gallery() {
  const t = useTranslations("home_v2.galeria");

  return (
    <section className="section galeria">
      <div className="container">
        <div className="galeria-head">
          <div className="reveal">
            <span className="eyebrow">{t("eyebrow")}</span>
            <h2>{t("title")}</h2>
          </div>
          <p className="reveal delay-1">{t("lead")}</p>
        </div>

        <div className="galeria-grid">
          {TILES.map(({ className, src, titleKey, subKey }, i) => (
            <div key={className} className={`tile ${className} scale-in`} style={{ transitionDelay: `${i * 60}ms` }}>
              <Image src={src} alt={t(titleKey)} fill className="img-cover" sizes="(max-width: 740px) 50vw, 33vw" />
              <div className="tile-overlay">
                <div>
                  <h4>{t(titleKey)}</h4>
                  <p>{t(subKey)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
