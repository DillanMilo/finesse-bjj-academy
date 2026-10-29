import type { MetadataRoute } from "next";
import { IS_PRODUCTION, SITE_URL } from "@/lib/seo";
export default function robots(): MetadataRoute.Robots {
  return IS_PRODUCTION
    ? { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: `${SITE_URL}/sitemap.xml` }
    : { rules: { userAgent: "*", disallow: "/" } };
}
