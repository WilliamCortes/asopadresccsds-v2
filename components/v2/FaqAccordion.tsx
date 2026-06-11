"use client";

import { useState } from "react";

interface FaqAccordionProps {
  items: { q: string; a: string }[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="faq">
      {items.map((item, i) => (
        <div key={i} className={`faq-item ${openIndex === i ? "is-open" : ""}`}>
          <button
            type="button"
            className="faq-q"
            onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
            aria-expanded={openIndex === i}
          >
            {item.q}
          </button>
          <div className="faq-a">{item.a}</div>
        </div>
      ))}
    </div>
  );
}
