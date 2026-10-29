import redirects from "./legacy-redirects.json";
import source from "./legacy-posts.json";
export interface ArchiveNode {
  tag: string;
  children: (ArchiveNode | string)[];
  href?: string | null;
  src?: string | null;
  alt?: string;
  width?: number;
  height?: number;
}
export interface LegacyPost {
  path: string;
  slug: string;
  category: string;
  title: string;
  description: string;
  published: string;
  modified: string;
  sourceUrl: string;
  body: (ArchiveNode | string)[];
}
export const legacyPosts = source as LegacyPost[];
export const indexableLegacyPosts = legacyPosts.filter(post => !redirects.some(redirect => redirect.source === post.path));
export function getLegacyPost(category: string, slug: string) {
  return legacyPosts.find(post => post.category === category && post.slug === slug);
}
