import type { MetadataRoute } from "next";
import { staticPages, SITE_URL, IS_PRODUCTION } from "@/lib/seo";
import { posts } from "@/lib/posts";
import { indexableLegacyPosts } from "@/lib/legacy-posts";
import { competitions } from "@/lib/competitions";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!IS_PRODUCTION) return [];
  return [
    ...staticPages.map(([path]) => ({ url: new URL(path, SITE_URL).href })),
    ...posts.map(post => ({ url: `${SITE_URL}/news/${post.slug}` })),
    { url: `${SITE_URL}/news/archive` },
    ...indexableLegacyPosts.map(post => ({ url: `${SITE_URL}${post.path}`, lastModified: post.modified })),
    ...competitions.map(event => ({ url: `${SITE_URL}/competitions/${event.slug}` })),
  ];
}
