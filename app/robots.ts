import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/es/", "/en/", "/fr/"],
        disallow: ["/admin/", "/api/", "/_next/"],
      },
    ],
    sitemap: "https://asopadresccsds.org/sitemap.xml",
  };
}
