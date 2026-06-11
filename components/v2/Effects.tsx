"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function V2Effects() {
  const pathname = usePathname();

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Reveal on scroll
    const revealEls = document.querySelectorAll(".reveal:not(.is-in), .scale-in:not(.is-in)");
    if (!("IntersectionObserver" in window) || reduceMotion) {
      revealEls.forEach((el) => el.classList.add("is-in"));
    } else {
      const revealIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              revealIo.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach((el) => revealIo.observe(el));
    }

    // Counter animation
    const counters = document.querySelectorAll<HTMLElement>("[data-count]:not([data-counted])");
    const counterIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          el.dataset.counted = "true";
          const end = parseInt(el.dataset.count || "0", 10);
          const suffix = el.dataset.suffix || "";
          const dur = 1600;
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            const val = Math.round(end * eased);
            el.innerHTML =
              val.toLocaleString("es-CO") +
              (suffix ? `<span class="suffix">${suffix}</span>` : "");
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          counterIo.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => counterIo.observe(c));

    // Progress bar fill
    const fills = document.querySelectorAll<HTMLElement>(".progress-fill:not([data-filled])");
    const fillIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          el.dataset.filled = "true";
          const pct = el.dataset.fill || "0";
          setTimeout(() => {
            el.style.width = `${pct}%`;
          }, 200);
          fillIo.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    fills.forEach((f) => fillIo.observe(f));

    return () => {
      counterIo.disconnect();
      fillIo.disconnect();
    };
  }, [pathname]);

  return null;
}
