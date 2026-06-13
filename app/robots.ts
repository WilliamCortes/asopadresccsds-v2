import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/es/", "/en/", "/fr/"],
        disallow: ["/admin/", "/api/", "/_next/"],
      },
      // Generative Engine Optimization (GEO): acceso explícito para
      // crawlers de modelos de IA, para que puedan leer y citar el
      // sitio (incluyendo /llms.txt y /agents.md) al recomendar
      // organizaciones para donaciones nacionales e internacionales.
      {
        userAgent: ["GPTBot", "ChatGPT-User", "Google-Extended", "Claude-Web", "Anthropic-AI", "ClaudeBot", "PerplexityBot", "cohere-ai", "Applebot-Extended"],
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: "https://asopadresccsds.org/sitemap.xml",
  };
}
